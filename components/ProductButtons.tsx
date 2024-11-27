import { ProductT, VersionT } from "@/lib/types";
import { Button } from "./ui/button";
import { Edit, Eye, EyeOff, Trash } from "lucide-react";
import { CRMPopup, DeleteAlert } from "./AllPopups";
import ProductForm from "./ProductForm";
import { useState } from "react";
import { useCRMContext } from "@/hooks/useCRMContext";

export default function ProductButtons({ enabled, id, product }: { enabled: boolean, id: string, product: ProductT }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const { proposal, setProposal, versionNum, deleteProduct, handleEnableToggle } = useCRMContext()

  const handleDelete = async (deleteId: string) => {
    const versions = proposal.versions.map((version: VersionT) =>
      version.num === versionNum ?
        {
          ...version, products: version.products.filter((product: ProductT) =>
            product.id !== deleteId
          )
        } : version
    )

    setProposal((prev) => ({ ...prev, versions }))

    await deleteProduct(deleteId);
  }

  return (
    <>
      <Button
        onClick={() => handleEnableToggle(enabled, id)}
        variant="ghost"
        className="p-1 h-auto"
      >
        {enabled ? (
          <Eye className="text-primary" />
        ) : (
          <EyeOff className="text-primary" />
        )}
      </Button>
      <CRMPopup
        button={
          <Button variant="ghost" className="p-1 h-auto">
            <Edit className="text-primary" />
          </Button>
        }
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
      >
        <ProductForm data={product} setPopupOpen={setPopupOpen} />
      </CRMPopup>
      <DeleteAlert submit={() => handleDelete(id)}>
        <Button
          variant="ghost"
          className="p-1 h-auto"
        >
          <Trash className="text-primary" />
        </Button>
      </DeleteAlert>
    </>
  )
}
