/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as FormsFormIdPreviewImport } from './routes/forms/$formId/preview'

// Create Virtual Routes

const PaymentLazyImport = createFileRoute('/payment')()
const ChangelogsLazyImport = createFileRoute('/changelogs')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()
const ProjectsIndexLazyImport = createFileRoute('/projects/')()
const FormsIndexLazyImport = createFileRoute('/forms/')()
const DashboardsIndexLazyImport = createFileRoute('/dashboards/')()
const AutomationsIndexLazyImport = createFileRoute('/automations/')()
const FormsDesignerLazyImport = createFileRoute('/forms/designer')()
const AutomationsDesignerLazyImport = createFileRoute('/automations/designer')()
const ProjectsProjectIdIndexLazyImport = createFileRoute(
  '/projects/$projectId/',
)()
const DashboardsDashboardIdIndexLazyImport = createFileRoute(
  '/dashboards/$dashboardId/',
)()
const CommunicationsEmailsIndexLazyImport = createFileRoute(
  '/communications/emails/',
)()
const CommunicationsContactsIndexLazyImport = createFileRoute(
  '/communications/contacts/',
)()
const ProjectsProjectIdReadmeLazyImport = createFileRoute(
  '/projects/$projectId/readme',
)()
const ProjectsProjectIdGuidelinesLazyImport = createFileRoute(
  '/projects/$projectId/guidelines',
)()
const ProjectsProjectIdDocsLazyImport = createFileRoute(
  '/projects/$projectId/docs',
)()
const ProjectsProjectIdAnalyticsLazyImport = createFileRoute(
  '/projects/$projectId/analytics',
)()
const FormsFormIdResponsesLazyImport = createFileRoute(
  '/forms/$formId/responses',
)()
const FormsFormIdFillLazyImport = createFileRoute('/forms/$formId/fill')()
const FormsFormIdAnalyticsLazyImport = createFileRoute(
  '/forms/$formId/analytics',
)()
const DashboardsDashboardIdDesignerLazyImport = createFileRoute(
  '/dashboards/$dashboardId/designer',
)()
const CommunicationsEmailsTemplatesLazyImport = createFileRoute(
  '/communications/emails/templates',
)()
const CommunicationsEmailsDesignerLazyImport = createFileRoute(
  '/communications/emails/designer',
)()
const ProjectsProjectIdTasksTaskIdIndexLazyImport = createFileRoute(
  '/projects/$projectId/tasks/$taskId/',
)()

// Create/Update Routes

const PaymentLazyRoute = PaymentLazyImport.update({
  path: '/payment',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/payment.lazy').then((d) => d.Route))

const ChangelogsLazyRoute = ChangelogsLazyImport.update({
  path: '/changelogs',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/changelogs.lazy').then((d) => d.Route))

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const ProjectsIndexLazyRoute = ProjectsIndexLazyImport.update({
  path: '/projects/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/projects/index.lazy').then((d) => d.Route),
)

const FormsIndexLazyRoute = FormsIndexLazyImport.update({
  path: '/forms/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/forms/index.lazy').then((d) => d.Route))

const DashboardsIndexLazyRoute = DashboardsIndexLazyImport.update({
  path: '/dashboards/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/dashboards/index.lazy').then((d) => d.Route),
)

const AutomationsIndexLazyRoute = AutomationsIndexLazyImport.update({
  path: '/automations/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/automations/index.lazy').then((d) => d.Route),
)

const FormsDesignerLazyRoute = FormsDesignerLazyImport.update({
  path: '/forms/designer',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/forms/designer.lazy').then((d) => d.Route),
)

const AutomationsDesignerLazyRoute = AutomationsDesignerLazyImport.update({
  path: '/automations/designer',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/automations/designer.lazy').then((d) => d.Route),
)

const AuthLoginRoute = AuthLoginImport.update({
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsProjectIdIndexLazyRoute = ProjectsProjectIdIndexLazyImport.update(
  {
    path: '/projects/$projectId/',
    getParentRoute: () => rootRoute,
  } as any,
).lazy(() =>
  import('./routes/projects/$projectId/index.lazy').then((d) => d.Route),
)

const DashboardsDashboardIdIndexLazyRoute =
  DashboardsDashboardIdIndexLazyImport.update({
    path: '/dashboards/$dashboardId/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/dashboards/$dashboardId/index.lazy').then((d) => d.Route),
  )

const CommunicationsEmailsIndexLazyRoute =
  CommunicationsEmailsIndexLazyImport.update({
    path: '/communications/emails/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/communications/emails/index.lazy').then((d) => d.Route),
  )

const CommunicationsContactsIndexLazyRoute =
  CommunicationsContactsIndexLazyImport.update({
    path: '/communications/contacts/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/communications/contacts/index.lazy').then((d) => d.Route),
  )

const ProjectsProjectIdReadmeLazyRoute =
  ProjectsProjectIdReadmeLazyImport.update({
    path: '/projects/$projectId/readme',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/projects/$projectId/readme.lazy').then((d) => d.Route),
  )

const ProjectsProjectIdGuidelinesLazyRoute =
  ProjectsProjectIdGuidelinesLazyImport.update({
    path: '/projects/$projectId/guidelines',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/projects/$projectId/guidelines.lazy').then((d) => d.Route),
  )

const ProjectsProjectIdDocsLazyRoute = ProjectsProjectIdDocsLazyImport.update({
  path: '/projects/$projectId/docs',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/projects/$projectId/docs.lazy').then((d) => d.Route),
)

const ProjectsProjectIdAnalyticsLazyRoute =
  ProjectsProjectIdAnalyticsLazyImport.update({
    path: '/projects/$projectId/analytics',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/projects/$projectId/analytics.lazy').then((d) => d.Route),
  )

const FormsFormIdResponsesLazyRoute = FormsFormIdResponsesLazyImport.update({
  path: '/forms/$formId/responses',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/forms/$formId/responses.lazy').then((d) => d.Route),
)

const FormsFormIdFillLazyRoute = FormsFormIdFillLazyImport.update({
  path: '/forms/$formId/fill',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/forms/$formId/fill.lazy').then((d) => d.Route),
)

const FormsFormIdAnalyticsLazyRoute = FormsFormIdAnalyticsLazyImport.update({
  path: '/forms/$formId/analytics',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/forms/$formId/analytics.lazy').then((d) => d.Route),
)

const DashboardsDashboardIdDesignerLazyRoute =
  DashboardsDashboardIdDesignerLazyImport.update({
    path: '/dashboards/$dashboardId/designer',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/dashboards/$dashboardId/designer.lazy').then(
      (d) => d.Route,
    ),
  )

const CommunicationsEmailsTemplatesLazyRoute =
  CommunicationsEmailsTemplatesLazyImport.update({
    path: '/communications/emails/templates',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/communications/emails/templates.lazy').then(
      (d) => d.Route,
    ),
  )

const CommunicationsEmailsDesignerLazyRoute =
  CommunicationsEmailsDesignerLazyImport.update({
    path: '/communications/emails/designer',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/communications/emails/designer.lazy').then((d) => d.Route),
  )

const FormsFormIdPreviewRoute = FormsFormIdPreviewImport.update({
  path: '/forms/$formId/preview',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsProjectIdTasksTaskIdIndexLazyRoute =
  ProjectsProjectIdTasksTaskIdIndexLazyImport.update({
    path: '/projects/$projectId/tasks/$taskId/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/projects/$projectId/tasks/$taskId/index.lazy').then(
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
    '/changelogs': {
      preLoaderRoute: typeof ChangelogsLazyImport
      parentRoute: typeof rootRoute
    }
    '/payment': {
      preLoaderRoute: typeof PaymentLazyImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/automations/designer': {
      preLoaderRoute: typeof AutomationsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/forms/designer': {
      preLoaderRoute: typeof FormsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/automations/': {
      preLoaderRoute: typeof AutomationsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/dashboards/': {
      preLoaderRoute: typeof DashboardsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/forms/': {
      preLoaderRoute: typeof FormsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/projects/': {
      preLoaderRoute: typeof ProjectsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/forms/$formId/preview': {
      preLoaderRoute: typeof FormsFormIdPreviewImport
      parentRoute: typeof rootRoute
    }
    '/communications/emails/designer': {
      preLoaderRoute: typeof CommunicationsEmailsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/communications/emails/templates': {
      preLoaderRoute: typeof CommunicationsEmailsTemplatesLazyImport
      parentRoute: typeof rootRoute
    }
    '/dashboards/$dashboardId/designer': {
      preLoaderRoute: typeof DashboardsDashboardIdDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/forms/$formId/analytics': {
      preLoaderRoute: typeof FormsFormIdAnalyticsLazyImport
      parentRoute: typeof rootRoute
    }
    '/forms/$formId/fill': {
      preLoaderRoute: typeof FormsFormIdFillLazyImport
      parentRoute: typeof rootRoute
    }
    '/forms/$formId/responses': {
      preLoaderRoute: typeof FormsFormIdResponsesLazyImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/analytics': {
      preLoaderRoute: typeof ProjectsProjectIdAnalyticsLazyImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/docs': {
      preLoaderRoute: typeof ProjectsProjectIdDocsLazyImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/guidelines': {
      preLoaderRoute: typeof ProjectsProjectIdGuidelinesLazyImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/readme': {
      preLoaderRoute: typeof ProjectsProjectIdReadmeLazyImport
      parentRoute: typeof rootRoute
    }
    '/communications/contacts/': {
      preLoaderRoute: typeof CommunicationsContactsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/communications/emails/': {
      preLoaderRoute: typeof CommunicationsEmailsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/dashboards/$dashboardId/': {
      preLoaderRoute: typeof DashboardsDashboardIdIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/': {
      preLoaderRoute: typeof ProjectsProjectIdIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/tasks/$taskId/': {
      preLoaderRoute: typeof ProjectsProjectIdTasksTaskIdIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  AboutLazyRoute,
  ChangelogsLazyRoute,
  PaymentLazyRoute,
  AuthLoginRoute,
  AutomationsDesignerLazyRoute,
  FormsDesignerLazyRoute,
  AutomationsIndexLazyRoute,
  DashboardsIndexLazyRoute,
  FormsIndexLazyRoute,
  ProjectsIndexLazyRoute,
  FormsFormIdPreviewRoute,
  CommunicationsEmailsDesignerLazyRoute,
  CommunicationsEmailsTemplatesLazyRoute,
  DashboardsDashboardIdDesignerLazyRoute,
  FormsFormIdAnalyticsLazyRoute,
  FormsFormIdFillLazyRoute,
  FormsFormIdResponsesLazyRoute,
  ProjectsProjectIdAnalyticsLazyRoute,
  ProjectsProjectIdDocsLazyRoute,
  ProjectsProjectIdGuidelinesLazyRoute,
  ProjectsProjectIdReadmeLazyRoute,
  CommunicationsContactsIndexLazyRoute,
  CommunicationsEmailsIndexLazyRoute,
  DashboardsDashboardIdIndexLazyRoute,
  ProjectsProjectIdIndexLazyRoute,
  ProjectsProjectIdTasksTaskIdIndexLazyRoute,
])

/* prettier-ignore-end */
