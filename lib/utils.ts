import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FieldT, TableFieldT, AllFieldTypes, EnumFieldT } from '@/lib/fields';
import { z } from "zod";
import slugify from 'slugify';
import { Timestamp } from "firebase/firestore";
import { FactoryT, FreightT, ImageT, MarkupT, ProductT, ProspectionT } from "./types";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const translationFields: { [key: string]: string } = {
  company_name: 'Nome/Razão Social',
  fantasy_name: 'Nome Fantasia',
  name: 'Nome',
  info_email: 'Email',
  cpf: 'CPF',
  rg: 'RG',
  cnpj: 'CNPJ',
}

export type EntityTitleT = {
  plural: string,
  singular: string,
  sufix: string
};

export const mapEnum = {
  '0': 'Perdido',
  '1': 'Solicitado',
  '2': 'Enviado',
  '3': 'Revisão',
  '4': 'Esperando',
  '5': 'Negociação',
  '6': 'Fechado',
}

export const paymentEnum = {
  'cash': 'Dinheiro',
  'debit': 'Cartão de Débito',
  'credit': 'Cartão de Crédito',
  'bankslip': 'Boleto',
  'pix': 'Pix',
}

export const entityTitles: { [key: string]: EntityTitleT } = {
  representative: {
    plural: 'representações',
    singular: 'representação',
    sufix: 'a'
  },
  client: {
    plural: 'clientes',
    singular: 'cliente',
    sufix: 'o'
  },
  service: {
    plural: 'serviços',
    singular: 'serviço',
    sufix: 'o'
  },
  office: {
    plural: 'escritórios',
    singular: 'escritório',
    sufix: 'o'
  },
  factory: {
    plural: 'fábricas',
    singular: 'fábrica',
    sufix: 'a'
  },
  collaborator: {
    plural: 'colaboradores',
    singular: 'colaborador',
    sufix: 'o'
  },
  markup: {
    plural: 'marcações',
    singular: 'marcação',
    sufix: 'a'
  },
  freight: {
    plural: 'fretes',
    singular: 'frete',
    sufix: 'o'
  },
  prospection: {
    plural: 'prospecções',
    singular: 'prospecção',
    sufix: 'o' 
  },
  proposal: {
    plural: 'propostas',
    singular: 'proposta',
    sufix: 'a' 
  },
  product: {
    plural: 'produtos',
    singular: 'produto',
    sufix: 'o'
  }
}

export function timestampToDate(timestamp: Timestamp) {
  return new Date(timestamp.seconds*1000)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function unformatNumber(str?: string, percent: boolean = false) {
  if (!str) return 0;
  return parseFloat(str.replace('R$ ', '').replaceAll('.', '').replaceAll(',', '.')) * (percent ? 0.01 : 1)
}

export function formatCurrency(value: number) {
  return value > 0 ? value.toLocaleString('pt-br', { maximumFractionDigits: 2, style: 'currency', currency: 'BRL' }) : '-'
}

export function formatPercent(float: number | '') {
  try {
    if (float === '') return "-";
    
    const decimals: number = float.toString().split(".")[1]?.length || 0;
    const minimumFractionDigits: number = decimals >= 3 ? 2 : 0;
    const formated = float.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits });
    
    return formated;
  } catch (error: any) {
    console.log(error)
    return 'NaN'
  }
}

export async function fillCepFields(inputCep: string, form: any, path: string) {
  try {
    const cep = inputCep.replace(/\D/g, '');
    if (cep.length === 8) {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`,{
        method: 'GET',
      });
      
      const cepInfo = await res.json();

      if (cepInfo.erro) {
        form.resetField(path + 'address')
        form.resetField(path + 'state')
        form.resetField(path + 'city')
        form.resetField(path + 'complement')
      } else {
        const { logradouro, complemento, bairro, localidade, uf } = cepInfo;
        
        form.setValue(path + 'address', logradouro + ' ' + bairro, { shouldValidate: true });
        form.setValue(path + 'state', uf, { shouldValidate: true });
        form.setValue(path + 'city', localidade, { shouldValidate: true });
        form.setValue(path + 'complement', complemento, { shouldValidate: true });
      }
    }
  } catch(error) {
    console.log(error);
  }
}

export function createDefaultArray(fields: TableFieldT[] | { [key: string]: FieldT | EnumFieldT }): { [key: string] : '' | [] } {
  return Object.values(fields).map((field) => { return field.value }).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
}

// Retorna os valores vazios e as verificações de cada campo

export function formatFields(fields: AllFieldTypes | { [key: string]: TableFieldT; }, arrayKeys: string[]=[], optionals:string[]=[]) : [any, z.ZodObject<any, any>]{
  let defaultValues: { [key: string]: '' | [] } = {};
  let validationValues: { [key: string]: z.ZodType<any, any> } = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value['value']) {
      defaultValues[key] = '';
      validationValues[key] = optionals.includes(key) ? value.validation.optional().or(z.literal('')) : value.validation;
    } else if (arrayKeys.includes(key) || Array.isArray(value)) {
      // Se for vetor, tem que fazer um objeto com todos os campos
      defaultValues[key] = [];
      validationValues[key] = z.array(z.object(Object.values(value).reduce((acc: { [key: string]: z.ZodType<any, any> }, { value, validation }: any) => { acc[value] = validation; return acc; }, {}))).optional()
    } else {
      [defaultValues[key], validationValues[key]] = formatFields(value, optionals);
    }
  }

  return [defaultValues, z.object(validationValues)];
}

export function calculateTextWidth(size: number, text: string ) {
  let font = `${size}px verdana`;

  let canvas = document.createElement('canvas');
  let context = canvas.getContext("2d");
  if (context !== null) {
    context.font = font;
    let width = context.measureText(text).width + 2;
    let formattedWidth = Math.ceil(width) + "px";

    return formattedWidth;
  } else {
    return "";
  }
}

export const stringToSlug = (str: string) => {
  return slugify(str, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
  });
};

export const groupProductsByAmbient = (products: ProductT[]): Record<string, ProductT[]> => {
  const ambients = {};

  products.forEach((product) => {
    if (product.ambient) {
      const slug = stringToSlug(product.ambient)

      const originalCategoryKey = Object.keys(ambients).find((key) => stringToSlug(key) === slug) || product.ambient;

      if (!ambients[originalCategoryKey]) {
        ambients[originalCategoryKey] = [];
      }

      ambients[originalCategoryKey].push(product);
    } else {
      if (!ambients['Sem Categoria']) {
        ambients['Sem Categoria'] = [];
      }
      ambients['Sem Categoria'].push(product);
    }

  });

  return ambients;
};

export function calculatePriceMarkup(cost: number, markup: MarkupT, quantity: number) {
  const markup12 = markup && cost ? unformatNumber(markup['12x'] as string) * cost * quantity : 0
  const markup6 = markup && cost ? Number(markup12) * (1 - unformatNumber(markup['6x'] as string, true)) : 0
  const markupCash = markup && cost ? Number(markup12) * (1 - unformatNumber(markup['cash'] as string, true)) : 0

  return { markup12, markup6, markupCash }
}

export async function resolvePromises(data: any): Promise<any> {
  if (data instanceof Promise) {
    return await data;
  }

  if (Array.isArray(data)) {
    return await Promise.all(data.map(resolvePromises));
  }

  if (data !== null && typeof data === 'object') {
    const resolvedData = { ...data };
    const entries = await Promise.all(
      Object.entries(data).map(async ([key, value]) => [key, await resolvePromises(value)])
    );
    for (const [key, value] of entries) {
      resolvedData[key] = value;
    }
    return resolvedData;
  }

  return data;
}

type CostMarkupProps = {
  cost: string,
  quantity?: number,
  selectedFactory?: FactoryT,
  selectedFreight?: FreightT,
  selectedMarkup?: MarkupT,
  selectedProspection?: ProspectionT,
  useDirectSale?: boolean
}

export function calculateCostMarkup({ cost, quantity, selectedFactory, selectedFreight, selectedMarkup, selectedProspection, useDirectSale }: CostMarkupProps) {
  function multiplyCost(value: number) {
    return unformatNumber(cost) * value;
  }

  const newQuantity = quantity === undefined ? 1 : quantity
  const direct_sale = useDirectSale && selectedFactory?.direct_sale ? selectedFactory.direct_sale : 0;
  const discount = selectedFactory?.discount ? selectedFactory.discount : 0;
  const freight = selectedFreight?.fee ? unformatNumber(selectedFreight.fee as string, true) : 0;
  const prospection = selectedProspection?.tax ? unformatNumber(selectedProspection.tax as string, true) : 0;
  const costBase = cost && selectedMarkup ? (unformatNumber(cost) - multiplyCost(discount) + multiplyCost(direct_sale)) * unformatNumber(selectedMarkup['12x'] as string) : 0;
  return selectedMarkup ? {
    'costBase': costBase * newQuantity,
    '12x': (costBase * (1 + freight + prospection)) * newQuantity,
    '6x': ((costBase * (1 + freight + prospection)) * (1 - unformatNumber(selectedMarkup['6x'] as string, true))) * newQuantity,
    'cash': ((costBase * (1 + freight + prospection)) * (1 - unformatNumber(selectedMarkup['cash'] as string, true)) * newQuantity)
  } : { 'costBase': 0, '12x': 0, '6x': 0, 'cash': 0 };
}

export async function uploadImageToFirestore(images: File[], path: string[]): Promise<ImageT | ''> {
  if (images && images.length > 0) {
    const imageId = path.join('/');
    const storageRef = ref(storage, imageId);

    // Load the image and crop it to 1:1 aspect ratio
    const { blob, size } = await new Promise<{ blob: Blob; size: number }>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error("Failed to read image data"));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const cropSize = Math.min(img.width, img.height); // Crop to the smaller dimension
          const canvas = document.createElement("canvas");
          canvas.width = cropSize;
          canvas.height = cropSize;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to create canvas context"));
            return;
          }

          const offsetX = (img.width - cropSize) / 2;
          const offsetY = (img.height - cropSize) / 2;

          ctx.drawImage(img, offsetX, offsetY, cropSize, cropSize, 0, 0, cropSize, cropSize);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve({ blob, size: cropSize });
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          }, "image/jpeg");
        };

        img.onerror = (err) => reject(err);
        img.src = e.target.result as string;
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(images[0]);
    });

    // Upload the cropped image to Firebase
    const upload = await uploadBytes(storageRef, blob).then(() => true).catch((error) => {
      console.log(error);
      return false;
    });

    if (upload) {
      return {
        path: imageId,
        width: size,
        height: size,
      };
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export async function imageToFileObject(image: ImageT): Promise<File> {
  const response = await fetch(image.path);
  const blob = await response.blob();

  // Extract name from URL or give it a default name
  const name = image.path.split('/').pop() || 'image.jpg';

  // Create a File object
  const fileObject = new File([blob], name, {
    type: blob.type,
    lastModified: Date.now(),
  });

  return fileObject
}

export function getSlideImageDimensions(width: number, height: number, maxImageDimension: { w: number, h: number }) {
  const widthRatio = maxImageDimension.w / width;
  const heightRatio = maxImageDimension.h / height;

  const scale = Math.min(widthRatio, heightRatio);

  return {
    w: width * scale,
    h: height * scale,
  };
};

export function getInsertIndex<T extends { date: Date }>(array: T[], date: Date) {
  const newDate = date.getTime();
  let low = 0;
  let high = array.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const midDate = array[mid].date.getTime();

    if (midDate < newDate) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}