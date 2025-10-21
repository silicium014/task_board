import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store'

// Этот тип расширяет дефолтные опции для RTL
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  // Можно добавить кастомные опции если нужно
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    // автоматически создать store если не передан
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Возвращаем объект store и все функции RTL
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}