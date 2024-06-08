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
const AppsProjectsIndexLazyImport = createFileRoute('/apps/projects/')()
const AppsFormsIndexLazyImport = createFileRoute('/apps/forms/')()
const AppsDashboardsIndexLazyImport = createFileRoute('/apps/dashboards/')()
const AppsAutomationsIndexLazyImport = createFileRoute('/apps/automations/')()
const AppsFormsDesignerLazyImport = createFileRoute('/apps/forms/designer')()
const AppsDashboardsDesignerLazyImport = createFileRoute(
  '/apps/dashboards/designer',
)()
const AppsAutomationsDesignerLazyImport = createFileRoute(
  '/apps/automations/designer',
)()
const AppsProjectsProjectIdIndexLazyImport = createFileRoute(
  '/apps/projects/$projectId/',
)()
const AppsCommunicationsEmailsIndexLazyImport = createFileRoute(
  '/apps/communications/emails/',
)()
const AppsFormsFormIdFillLazyImport = createFileRoute(
  '/apps/forms/$formId/fill',
)()
const AppsFormsFormIdDetailsLazyImport = createFileRoute(
  '/apps/forms/$formId/details',
)()
const AppsCommunicationsEmailsTemplatesLazyImport = createFileRoute(
  '/apps/communications/emails/templates',
)()
const AppsCommunicationsEmailsDesignerLazyImport = createFileRoute(
  '/apps/communications/emails/designer',
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

const AppsProjectsIndexLazyRoute = AppsProjectsIndexLazyImport.update({
  path: '/apps/projects/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/projects/index.lazy').then((d) => d.Route),
)

const AppsFormsIndexLazyRoute = AppsFormsIndexLazyImport.update({
  path: '/apps/forms/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/forms/index.lazy').then((d) => d.Route),
)

const AppsDashboardsIndexLazyRoute = AppsDashboardsIndexLazyImport.update({
  path: '/apps/dashboards/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/dashboards/index.lazy').then((d) => d.Route),
)

const AppsAutomationsIndexLazyRoute = AppsAutomationsIndexLazyImport.update({
  path: '/apps/automations/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/apps/automations/index.lazy').then((d) => d.Route),
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

const AppsAutomationsDesignerLazyRoute =
  AppsAutomationsDesignerLazyImport.update({
    path: '/apps/automations/designer',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/apps/automations/designer.lazy').then((d) => d.Route),
  )

const AppsProjectsProjectIdIndexLazyRoute =
  AppsProjectsProjectIdIndexLazyImport.update({
    path: '/apps/projects/$projectId/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/apps/projects/$projectId/index.lazy').then((d) => d.Route),
  )

const AppsCommunicationsEmailsIndexLazyRoute =
  AppsCommunicationsEmailsIndexLazyImport.update({
    path: '/apps/communications/emails/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/apps/communications/emails/index.lazy').then(
      (d) => d.Route,
    ),
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

const AppsCommunicationsEmailsTemplatesLazyRoute =
  AppsCommunicationsEmailsTemplatesLazyImport.update({
    path: '/apps/communications/emails/templates',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/apps/communications/emails/templates.lazy').then(
      (d) => d.Route,
    ),
  )

const AppsCommunicationsEmailsDesignerLazyRoute =
  AppsCommunicationsEmailsDesignerLazyImport.update({
    path: '/apps/communications/emails/designer',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/apps/communications/emails/designer.lazy').then(
      (d) => d.Route,
    ),
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
    '/apps/automations/designer': {
      preLoaderRoute: typeof AppsAutomationsDesignerLazyImport
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
    '/apps/automations/': {
      preLoaderRoute: typeof AppsAutomationsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/dashboards/': {
      preLoaderRoute: typeof AppsDashboardsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/forms/': {
      preLoaderRoute: typeof AppsFormsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/projects/': {
      preLoaderRoute: typeof AppsProjectsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/communications/emails/designer': {
      preLoaderRoute: typeof AppsCommunicationsEmailsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/communications/emails/templates': {
      preLoaderRoute: typeof AppsCommunicationsEmailsTemplatesLazyImport
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
    '/apps/communications/emails/': {
      preLoaderRoute: typeof AppsCommunicationsEmailsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/apps/projects/$projectId/': {
      preLoaderRoute: typeof AppsProjectsProjectIdIndexLazyImport
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
  AppsAutomationsDesignerLazyRoute,
  AppsDashboardsDesignerLazyRoute,
  AppsFormsDesignerLazyRoute,
  AppsAutomationsIndexLazyRoute,
  AppsDashboardsIndexLazyRoute,
  AppsFormsIndexLazyRoute,
  AppsProjectsIndexLazyRoute,
  AppsCommunicationsEmailsDesignerLazyRoute,
  AppsCommunicationsEmailsTemplatesLazyRoute,
  AppsFormsFormIdDetailsLazyRoute,
  AppsFormsFormIdFillLazyRoute,
  AppsCommunicationsEmailsIndexLazyRoute,
  AppsProjectsProjectIdIndexLazyRoute,
])

/* prettier-ignore-end */
