import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  common_all: {
    id: 'common.all',
    defaultMessage: 'Tutti',
  },
  network_error: {
    id: 'general.network_error',
    defaultMessage: 'Errore di rete: servizio non raggiungibile!',
  },
  installation: {
    id: 'auth.login.installation',
    defaultMessage: 'Installazione',
  },
  error_to_fetch_codes: {
    id: 'auth.login.error_to_fetch_codes',
    defaultMessage: 'Impossibile caricare i codici clienti!',
  },
  username_required: {
    id: 'auth.login.username_required',
    defaultMessage: 'Nome utente obbligatorio!',
  },
  password_required: {
    id: 'auth.login.password_required',
    defaultMessage: 'Password obbligatoria!',
  },
  installation_required: {
    id: 'auth.login.installation_required',
    defaultMessage: 'Installazione obbligatoria!',
  },
  LOGIN_WRONG_CREDENTIALS: {
    id: 'auth.login.wrong_credentials',
    defaultMessage: 'Nome utente o password errati!',
  },
})
