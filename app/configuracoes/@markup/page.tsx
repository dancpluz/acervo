import MarkupForm from "@/components/MarkupForm";
import FreightForm from "@/components/FreightForm";
import { getConfig } from '@/lib/dbRead';
import { formatPercent } from '@/lib/utils'
import { FreightT, MarkupT, ProspectionT } from "@/lib/types";
import ProspectionForm from "@/components/ProspectionForm";

export const revalidate = 30;

export default async function Markup() {
  const [markups, freights, prospections]: [MarkupT[], FreightT[], ProspectionT[]] = await Promise.all([getConfig('markup_freight', 'markup'), getConfig('markup_freight', 'freight'), getConfig('markup_freight', 'prospection')])

  const markupData = markups.map((e: MarkupT) => {
    return { ...e, '12x': e['12x'].toString().replace('.', ','), '6x': formatPercent(e['6x'] as number).replace('%', ''), cash: formatPercent(e['cash'] as number).replace('%','')}
  })

  const freightData = freights.map((e: FreightT) => {
    return { ...e, region: e.region, fee: e.fee === 0 ? '' : formatPercent(e.fee as number).replace('%', '') }
  })

  const prospectionData = prospections.map((e: ProspectionT) => {
    return { ...e, title: e.title, tax: e.tax === 0 ? '' : formatPercent(e.tax as number).replace('%', '') }
  })

  return (
    <div className="flex pt-4 flex-col flex-1 gap-6">
      <div className="flex flex-col gap-2 py-4 px-6 border border-secondary rounded-lg">
        <h2 className="text-xl">Marcação</h2>
        <MarkupForm data={markupData} />
      </div>
      <div className="flex flex-col gap-2 py-4 px-6 border border-secondary rounded-lg">
        <h2 className="text-xl">Frete</h2>
        <FreightForm data={freightData} />
      </div>
      <div className="flex flex-col gap-2 py-4 px-6 border border-secondary rounded-lg">
        <h2 className="text-xl">Prospecção</h2>
        <ProspectionForm data={prospectionData} />
      </div>
    </div>
  )
}

