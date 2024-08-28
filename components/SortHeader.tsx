import { FactoryT, RepresentativeT, OfficeT, ClientT, CollaboratorT, ServiceT } from "@/lib/types";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUpAZ, ArrowDownZA, ArrowUp01, ArrowDown10 } from "lucide-react";

type Props = {
  column: Column<FactoryT> | Column<RepresentativeT> | Column<OfficeT> | Column<ClientT> | Column<CollaboratorT> | Column<ServiceT>
  header: string,
  center?: boolean,
  numeric?: boolean,
}

export default function SortHeader({column, header, center, numeric} : Props) {
  if (numeric) {
    return (
      <div className={`flex ${center ? 'justify-center' : ''}`}>
        <button
          className={`flex items-center gap-1 hover:outline outline-background rounded outline-1 outline-offset-4`}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {column.getIsSorted() === "asc" ? <ArrowUp01 className="h-4 w-4" /> : column.getIsSorted() === "desc" ? <ArrowDown10 className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
          {header}
        </button>
      </div>
    )
  }

  return (
    <div className={`flex ${center ? 'justify-center' : ''}`}>
      <button
        className={`flex items-center gap-1 hover:outline outline-background rounded outline-1 outline-offset-4`}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {column.getIsSorted() === "asc" ? <ArrowUpAZ className="h-4 w-4" /> : column.getIsSorted() === "desc" ? <ArrowDownZA className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
        {header}
      </button>
    </div>
  )
}