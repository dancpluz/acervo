'use client'

import { useState } from "react"
import { ImageT } from "@/lib/types"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Text, Image as SlideImage } from "react-pptx";
import { CustomTooltip } from "./AllPopups"


export function ProductImage({ image, alt }: { image?: ImageT | '', alt: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (!image || !image.path.toLowerCase().includes("http")) return null

  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div
            className="overflow-hidden cursor-pointer"
          >
            <Image
              alt={alt}
              className='object-cover h-full w-full'
              width={256}
              height={256}
              src={image.path}
            />
          </div>
        </DialogTrigger>
      <DialogContent onInteractOutside={() => setIsOpen(false)} className="overflow-hidden sm:max-w-[425px]">
          <div className="relative min-w-[200px] min-h-[200px]">
            {isLoading && (
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <LoaderCircle className='text-primary size-14 animate-spin' />
              </div>
            )}
            <Image
              alt={alt}
              className={cn(
                'object-contain w-full h-auto transition-opacity duration-300',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              width={image.width}
              height={image.height}
              src={image.path}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
  )
}

export function FinishSlideImage({ image, right, text, index }: { image?: ImageT | '', right?: boolean, text: string, index: number }) {
  if (!image || !image.path.toLowerCase().includes("http")) return null
  
  const x = right ? 0.5 + index * 1.3 : 7.4 - index * 1.3
  const imageStyle = { x, y: 0.53, h: 0.9, w: 0.9 }

  return (
    <>
      <Text style={{
        x: x + (0.04 * (index + 1)), y: 1.48, w: 1.5, h: 0.4,
        fontSize: 8,
        fontFace: 'Open Sans',
      }}>
        {text}
      </Text>
      <SlideImage
        src={{ kind: "path", path: image.path }}
        style={imageStyle}
      />
    </>
  )
}

export function FinishImage({ tooltip, image, alt }: { tooltip: string, image?: ImageT | '', alt: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (!image || !image.path.toLowerCase().includes("http")) return null

  return (
    <>
      <CustomTooltip tooltip={tooltip}>
        <div
          className="overflow-hidden border border-primary rounded-xl size-8 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Image
            alt={alt}
            className='object-cover h-full w-full'
            width={64}
            height={64}
            src={image.path}
          />
        </div>
      </CustomTooltip>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onInteractOutside={() => setIsOpen(false)} className="overflow-hidden sm:max-w-[425px]">
          <div className="relative min-w-[200px] min-h-[100px]">
            {isLoading && (
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <LoaderCircle className='text-primary size-14 animate-spin' />
              </div>
            )}
            <Image
              alt={alt}
              className={cn(
                'object-contain w-full h-auto transition-opacity duration-300',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              width={image.width}
              height={image.height}
              src={image.path}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

