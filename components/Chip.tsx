type Props = {
  label: string | number
}

export default function Chip({ label }: Props) {
  if (label === '') {
    return '-'
  }

  return (
    <div className='inline-block text-center px-1 text-xs justify-center outline-secondary outline-1 outline outline-offset-4 rounded'>{typeof label == 'number' ? '$'.repeat(label) : label}</div>
  )
}
