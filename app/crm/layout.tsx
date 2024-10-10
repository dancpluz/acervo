import { CRMProvider } from "@/hooks/useCRMContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProvider>
      {children}
    </CRMProvider>
  )
}
