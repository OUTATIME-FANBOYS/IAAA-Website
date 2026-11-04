import {Button, Card, Text} from '@sanity/ui'
import {useCallback, useState} from 'react'
import {useFormValue, type StringInputProps} from 'sanity'

// Public address of the website; set SANITY_STUDIO_SITE_URL when building the Studio.
const SITE_URL = (process.env.SANITY_STUDIO_SITE_URL || '').replace(/\/$/, '')

/** Shows the personal profile-form link for an invite, with a copy button. */
export function InviteLinkInput(_props: StringInputProps) {
  const token = useFormValue(['token']) as string | undefined
  const [copied, setCopied] = useState(false)
  const link = token ? `${SITE_URL}/join/profile?invite=${token}` : ''

  const copy = useCallback(() => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [link])

  if (!link) return <Text size={1}>The link appears once the invite is created.</Text>
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      <Card padding={3} radius={2} border>
        <Text size={1}>
          <span style={{wordBreak: 'break-all', fontFamily: 'monospace'}}>{link}</span>
        </Text>
      </Card>
      <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
        <Button text={copied ? 'Copied' : 'Copy link'} tone="primary" onClick={copy} />
        {SITE_URL ? null : (
          <Text size={1} muted>
            Add the website address in front of this path before sending it.
          </Text>
        )}
      </div>
    </div>
  )
}
