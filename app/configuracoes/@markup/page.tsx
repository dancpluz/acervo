import MarkupForm from "@/components/MarkupForm";
import FreightForm from "@/components/FreightForm";
import { getMarkup, getFreight } from '@/lib/dbRead';
import { formatPercent } from '@/lib/utils'
import { FreightT, MarkupT } from "@/lib/types";

export default async function Markup() {
  const [markup,freight]: [MarkupT[], FreightT[]] = await Promise.all([getMarkup(), getFreight()])

  const markupData = markup.map((e: MarkupT) => {
    return { ...e, '6x': formatPercent(e['6x'] as number).replace('%', ''), '12x': formatPercent(e['12x'] as number).replace('%', ''), cash: formatPercent(e['cash'] as number).replace('%','')}
  })

  const freightData = freight.map((e: FreightT) => {
    return { region: e.region, fee: e.fee === 0 ? '' : formatPercent(e.fee as number).replace('%', '') }
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
    </div>
  )
}

