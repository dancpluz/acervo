import MarkupForm from "@/components/MarkupForm";
import FreightForm from "@/components/FreightForm";
import ProspectionForm from "@/components/ProspectionForm";

export default function Markup() {
  return (
    <div className="flex pt-4 flex-col flex-1 gap-6">
      <div className="flex flex-col gap-2 py-4 px-6 border border-secondary rounded-lg">
        <h2 className="text-xl">Marcação</h2>
        <MarkupForm />
      </div>
      <div className="flex flex-col gap-2 py-4 px-6 border border-secondary rounded-lg">
        <h2 className="text-xl">Frete</h2>
        <FreightForm />
      </div>
      <div className="flex flex-col gap-2 py-4 px-6 border border-secondary rounded-lg">
        <h2 className="text-xl">Prospecção</h2>
        <ProspectionForm />
      </div>
    </div>
  )
}

