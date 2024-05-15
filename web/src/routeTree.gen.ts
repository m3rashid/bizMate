/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const PaymentLazyImport = createFileRoute('/payment')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()
const AuthLoginLazyImport = createFileRoute('/auth/login')()
const AppsFormsIndexLazyImport = createFileRoute('/apps/forms/')()
const AppsFlowsIndexLazyImport = createFileRoute('/apps/flows/')()
const AppsDashboardsIndexLazyImport = createFileRoute('/apps/dashboards/')()
const AppsFormsDesignerLazyImport = createFileRoute('/apps/forms/designer')()
const AppsDashboardsDesignerLazyImport = createFileRoute(
  '/apps/dashboards/designer',
)()
const AppsFormsFormIdFillLazyImport = createFileRoute(
  '/apps/forms/$formId/fill',
)()
const AppsFormsFormIdDetailsLazyImport = createFileRoute(
  '/apps/forms/$formId/details',
)()

// Create/Update Routes

const PaymentLazyRoute = PaymentLazyImport.update({
  path: '/payment',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/payment.lazy').then((d) => d.Route))

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AuthLoginLazyRoute = AuthLoginLazyImport.update({
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/auth/login.lazy').then((d) => d.Route))

const AppsFormsIndexLazyRoute = AppsFormsIndexLazyImport.update({
  path: '/apps/forms/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/forms/index.lazy').then((d) => d.Route),
)

const AppsFlowsIndexLazyRoute = AppsFlowsIndexLazyImport.update({
  path: '/apps/flows/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/flows/index.lazy').then((d) => d.Route),
)

const AppsDashboardsIndexLazyRoute = AppsDashboardsIndexLazyImport.update({
  path: '/apps/dashboards/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/dashboards/index.lazy').then((d) => d.Route),
)

const AppsFormsDesignerLazyRoute = AppsFormsDesignerLazyImport.update({
  path: '/apps/forms/designer',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/forms/designer.lazy').then((d) => d.Route),
)

const AppsDashboardsDesignerLazyRoute = AppsDashboardsDesignerLazyImport.update(
  {
    path: '/apps/dashboards/designer',
    getParentRoute: () => rootRoute,
  } as any,
).lazy(() =>
  import('./routes/apps/dashboards/designer.lazy').then((d) => d.Route),
)

const AppsFormsFormIdFillLazyRoute = AppsFormsFormIdFillLazyImport.update({
  path: '/apps/forms/$formId/fill',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/forms/$formId/fill.lazy').then((d) => d.Route),
)

const AppsFormsFormIdDetailsLazyRoute = AppsFormsFormIdDetailsLazyImport.update(
  {
    path: '/apps/forms/$formId/details',
    getParentRoute: () => rootRoute,
  } as any,
).lazy(() =>
  import('./routes/apps/forms/$formId/details.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/payment': {
      preLoaderRoute: typeof PaymentLazyImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      preLoaderRoute: typeof AuthLoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/dashboards/designer': {
      preLoaderRoute: typeof AppsDashboardsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/forms/designer': {
      preLoaderRoute: typeof AppsFormsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/dashboards/': {
      preLoaderRoute: typeof AppsDashboardsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/flows/': {
      preLoaderRoute: typeof AppsFlowsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/forms/': {
      preLoaderRoute: typeof AppsFormsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/forms/$formId/details': {
      preLoaderRoute: typeof AppsFormsFormIdDetailsLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/forms/$formId/fill': {
      preLoaderRoute: typeof AppsFormsFormIdFillLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  AboutLazyRoute,
  PaymentLazyRoute,
  AuthLoginLazyRoute,
  AppsDashboardsDesignerLazyRoute,
  AppsFormsDesignerLazyRoute,
  AppsDashboardsIndexLazyRoute,
  AppsFlowsIndexLazyRoute,
  AppsFormsIndexLazyRoute,
  AppsFormsFormIdDetailsLazyRoute,
  AppsFormsFormIdFillLazyRoute,
])

/* prettier-ignore-end */
