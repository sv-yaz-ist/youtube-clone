import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved
} from '@testing-library/vue'
import BaseModal from './BaseModal.vue'
import icons from '../icons'

function renderModal(body = '', footer = '', withCloseButton = false) {
  const options = {
    props: {
      withCloseButton
    },
    slots: {
      default: body,
      footer
    }
  }

  return render(BaseModal, options)
}

function assertModalClosed(body) {
  return waitForElementToBeRemoved([
    screen.queryByText(body),
    screen.queryByTestId('base-modal-overlay')
  ])
}

it('renders with body and footer', () => {
  const body = 'This is body'
  const footer = 'This is footer'

  renderModal(body, footer)

  screen.getByText(body)
  screen.getByText(footer)
})

it('renders with close button', () => {
  const withCloseButton = true

  renderModal('', '', withCloseButton)

  expect(screen.getByTestId('base-icon').innerHTML).toBe(icons['x'])
})

it('renders without close button', () => {
  const withCloseButton = false

  renderModal('', '', withCloseButton)

  expect(screen.queryByTestId('base-icon')).toBeNull()
})

it('closes when clicking close button', () => {
  const body = 'This is body'
  const withCloseButton = true
  renderModal(body, '', withCloseButton)

  fireEvent.click(screen.getByTestId('base-modal-button-close'))

  return assertModalClosed(body)
})

it('closes when clicking overlay', () => {
  const body = 'This is body'
  renderModal(body)

  fireEvent.click(screen.getByTestId('base-modal-overlay'))

  return assertModalClosed(body)
})

it('closes when clicking cancel button in the footer', () => {
  const body = 'This is body'
  const footer = `
    <template #footer="{ close }">
      <button @click="close">Cancel</button>
    </template>
  `
  renderModal(body, footer)

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

  return assertModalClosed(body)
})

it('closes when pressing esc key', () => {
  const body = 'This is body'
  renderModal(body)

  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Esc' })

  return assertModalClosed(body)
})
