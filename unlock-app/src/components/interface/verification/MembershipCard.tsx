import {
  AvatarImage,
  Fallback as AvatarFallback,
  Root as Avatar,
} from '@radix-ui/react-avatar'
import dayjs from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import { addressMinify } from '~/utils/strings'
import { useConfig } from '~/utils/withConfig'
import {
  RiCloseCircleFill as InvalidIcon,
  RiCheckboxCircleFill as ValidIcon,
} from 'react-icons/ri'
import { ReactNode } from 'react'
import { RiCloseLine as CloseIcon } from 'react-icons/ri'
import { Button } from '@unlock-protocol/ui'

dayjs.extend(relativeTimePlugin)

interface Props {
  timestamp: number
  name: string
  image: string
  lockAddress: string
  userMetadata: Record<string, any>
  network: number
  invalid?: string
  checkedInAt?: number
  owner: string
  keyId: string
  children?: ReactNode
  onClose?: () => void
  showWarning?: boolean
}

export function MembershipCard({
  name,
  lockAddress,
  image,
  timestamp,
  network,
  userMetadata,
  checkedInAt,
  invalid,
  owner,
  keyId,
  onClose,
  children = null,
}: Props) {
  const timeSinceSigned = dayjs().from(timestamp, true)
  const timeSinceCheckedIn = dayjs().from(checkedInAt, true)
  const config = useConfig()

  return (
    <div className="w-full max-w-sm bg-white rounded-xl">
      <div
        className={` ${
          invalid ? 'bg-red-500' : checkedInAt ? 'bg-amber-300' : 'bg-green-500'
        }   rounded-t-xl`}
      >
        <div className="flex items-center justify-end">
          {onClose && (
            <Button
              variant="borderless"
              onClick={(event) => {
                event.preventDefault()
                onClose()
              }}
              className="flex items-center justify-center p-2 rounded group"
              aria-label="Close"
            >
              <CloseIcon
                className="fill-white group-hover:fill-brand-ui-primary"
                size={24}
                key="close"
              />
            </Button>
          )}
        </div>
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center">
            {invalid ? (
              <InvalidIcon size={54} className="fill-white" />
            ) : (
              <ValidIcon size={54} className="fill-white" />
            )}
          </div>
          <p className="text-xl font-bold text-white">
            {invalid
              ? invalid
              : checkedInAt
              ? `Checked-in ${timeSinceCheckedIn} ago`
              : `${name}`}
          </p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-6">
          <Avatar>
            <AvatarImage
              className="flex items-center justify-center w-16 h-16 rounded-full"
              alt={name}
              src={image}
              width={50}
              height={50}
            />
            <AvatarFallback className="flex items-center justify-center w-20 h-20 uppercase rounded-full">
              {name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="font-medium"> {name} </h3>
            <Item label="ID" value={keyId} />
          </div>
        </div>
        <div className="space-y-2">
          <Item label="Lock Address" value={addressMinify(lockAddress)} />
          <Item label="Network" value={config.networks[network].name} />
          <Item label="Time since signed" value={timeSinceSigned} />
          <Item label="Owner" value={addressMinify(owner)} />
          {!!userMetadata?.public && (
            <MetadataItems metadata={userMetadata.public} />
          )}
          {!!userMetadata?.protected && (
            <MetadataItems metadata={userMetadata.protected} />
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

interface ItemProps {
  label: string
  value: string
}

export function Item({ label, value }: ItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500"> {label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function MetadataItems({
  metadata,
}: {
  metadata: Record<string, string>
}) {
  return (
    <>
      {Object.entries(metadata).map(([name, value]) => (
        <Item label={name} value={value} key={name} />
      ))}
    </>
  )
}

export function MembershipCardPlaceholder() {
  return (
    <div className="w-full max-w-sm bg-white rounded-xl">
      <div className="h-32 bg-gray-100 rounded-t-xl"></div>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center justify-center w-20 h-20 uppercase rounded-full bg-gray-50 animate-pulse"></div>
        </div>
        <div className="grid gap-2">
          <div className="w-full h-6 bg-gray-50 animate-pulse rounded-xl"></div>
          <div className="w-full h-6 bg-gray-50 animate-pulse rounded-xl"></div>
          <div className="w-full h-6 bg-gray-50 animate-pulse rounded-xl"></div>
          <div className="w-full h-6 bg-gray-50 animate-pulse rounded-xl"></div>
          <div className="w-full h-6 bg-gray-50 animate-pulse rounded-xl"></div>
        </div>
        <div className="w-full h-12 rounded-full bg-gray-50 animate-pulse"></div>
      </div>
    </div>
  )
}
