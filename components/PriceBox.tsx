export default function PriceBox({ title, text, className } : { title: string, text?: string, className?: string }) {
  return (
    <div className='flex rounded-sm border border-primary'>
      <div className={`p-2 text-tertiary text-center text-2xl border-r border-primary ${className}`}>
        {title}
      </div>
      <div className={`p-2 text-2xl min-w-16 text-center ${className}`}>
        {text ? text : '-'}
      </div>
    </div>
  )
}
