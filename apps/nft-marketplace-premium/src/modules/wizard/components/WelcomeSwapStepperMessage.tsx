import Alert from '@mui/material/Alert';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  DEXKIT_DISCORD_SUPPORT_CHANNEL,
  WIZARD_DOCS_URL,
} from '../../../constants';

export function WelcomeSwapStepperMessage() {
  const handleHrefDiscord = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={DEXKIT_DISCORD_SUPPORT_CHANNEL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  const handleHrefDocs = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={WIZARD_DOCS_URL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  return (
    <Alert severity="info">
      <FormattedMessage
        id="quick.wizard.swap.welcome.index.message"
        defaultMessage="Welcome to CryptoApp Builder KIT! Here you can quick start your crypto aggregator
    If you need support please reach us on our <a>dedicated Discord channel</a>. Please check our <d>docs</d> for whitelabels. Reach us at our email <b>info@dexkit.com</b> if you need a custom solution that the wizard not attend."
        values={{
          //@ts-ignore
          a: handleHrefDiscord,
          //@ts-ignore
          d: handleHrefDocs,
          //@ts-ignore
          b: (chunks) => <b>{chunks}</b>,
        }}
      />
    </Alert>
  );
}
