/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as AuthChooseWorkspaceImport } from './routes/auth/choose-workspace'
import { Route as WorkspaceIdFormsFormIdPreviewImport } from './routes/$workspaceId/forms/$formId/preview'

// Create Virtual Routes

const PaymentLazyImport = createFileRoute('/payment')()
const ChangelogsLazyImport = createFileRoute('/changelogs')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()
const WorkspaceIdProjectsIndexLazyImport = createFileRoute(
  '/$workspaceId/projects/',
)()
const WorkspaceIdFormsIndexLazyImport = createFileRoute(
  '/$workspaceId/forms/',
)()
const WorkspaceIdDashboardsIndexLazyImport = createFileRoute(
  '/$workspaceId/dashboards/',
)()
const WorkspaceIdAutomationsIndexLazyImport = createFileRoute(
  '/$workspaceId/automations/',
)()
const WorkspaceIdFormsDesignerLazyImport = createFileRoute(
  '/$workspaceId/forms/designer',
)()
const WorkspaceIdAutomationsDesignerLazyImport = createFileRoute(
  '/$workspaceId/automations/designer',
)()
const WorkspaceIdProjectsProjectIdIndexLazyImport = createFileRoute(
  '/$workspaceId/projects/$projectId/',
)()
const WorkspaceIdDashboardsDashboardIdIndexLazyImport = createFileRoute(
  '/$workspaceId/dashboards/$dashboardId/',
)()
const WorkspaceIdCommunicationsEmailsIndexLazyImport = createFileRoute(
  '/$workspaceId/communications/emails/',
)()
const WorkspaceIdCommunicationsContactsIndexLazyImport = createFileRoute(
  '/$workspaceId/communications/contacts/',
)()
const WorkspaceIdProjectsProjectIdReadmeLazyImport = createFileRoute(
  '/$workspaceId/projects/$projectId/readme',
)()
const WorkspaceIdProjectsProjectIdGuidelinesLazyImport = createFileRoute(
  '/$workspaceId/projects/$projectId/guidelines',
)()
const WorkspaceIdProjectsProjectIdDocsLazyImport = createFileRoute(
  '/$workspaceId/projects/$projectId/docs',
)()
const WorkspaceIdProjectsProjectIdAnalyticsLazyImport = createFileRoute(
  '/$workspaceId/projects/$projectId/analytics',
)()
const WorkspaceIdFormsFormIdResponsesLazyImport = createFileRoute(
  '/$workspaceId/forms/$formId/responses',
)()
const WorkspaceIdFormsFormIdFillLazyImport = createFileRoute(
  '/$workspaceId/forms/$formId/fill',
)()
const WorkspaceIdFormsFormIdAnalyticsLazyImport = createFileRoute(
  '/$workspaceId/forms/$formId/analytics',
)()
const WorkspaceIdDashboardsDashboardIdDesignerLazyImport = createFileRoute(
  '/$workspaceId/dashboards/$dashboardId/designer',
)()
const WorkspaceIdCommunicationsEmailsTemplatesLazyImport = createFileRoute(
  '/$workspaceId/communications/emails/templates',
)()
const WorkspaceIdCommunicationsEmailsDesignerLazyImport = createFileRoute(
  '/$workspaceId/communications/emails/designer',
)()
const WorkspaceIdProjectsProjectIdTasksTaskIdIndexLazyImport = createFileRoute(
  '/$workspaceId/projects/$projectId/tasks/$taskId/',
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

const AuthLoginRoute = AuthLoginImport.update({
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthChooseWorkspaceRoute = AuthChooseWorkspaceImport.update({
  path: '/auth/choose-workspace',
  getParentRoute: () => rootRoute,
} as any)

const WorkspaceIdProjectsIndexLazyRoute =
  WorkspaceIdProjectsIndexLazyImport.update({
    path: '/$workspaceId/projects/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/projects/index.lazy').then((d) => d.Route),
  )

const WorkspaceIdFormsIndexLazyRoute = WorkspaceIdFormsIndexLazyImport.update({
  path: '/$workspaceId/forms/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/$workspaceId/forms/index.lazy').then((d) => d.Route),
)

const WorkspaceIdDashboardsIndexLazyRoute =
  WorkspaceIdDashboardsIndexLazyImport.update({
    path: '/$workspaceId/dashboards/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/dashboards/index.lazy').then((d) => d.Route),
  )

const WorkspaceIdAutomationsIndexLazyRoute =
  WorkspaceIdAutomationsIndexLazyImport.update({
    path: '/$workspaceId/automations/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/automations/index.lazy').then((d) => d.Route),
  )

const WorkspaceIdFormsDesignerLazyRoute =
  WorkspaceIdFormsDesignerLazyImport.update({
    path: '/$workspaceId/forms/designer',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/forms/designer.lazy').then((d) => d.Route),
  )

const WorkspaceIdAutomationsDesignerLazyRoute =
  WorkspaceIdAutomationsDesignerLazyImport.update({
    path: '/$workspaceId/automations/designer',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/automations/designer.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdProjectsProjectIdIndexLazyRoute =
  WorkspaceIdProjectsProjectIdIndexLazyImport.update({
    path: '/$workspaceId/projects/$projectId/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/projects/$projectId/index.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdDashboardsDashboardIdIndexLazyRoute =
  WorkspaceIdDashboardsDashboardIdIndexLazyImport.update({
    path: '/$workspaceId/dashboards/$dashboardId/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/dashboards/$dashboardId/index.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdCommunicationsEmailsIndexLazyRoute =
  WorkspaceIdCommunicationsEmailsIndexLazyImport.update({
    path: '/$workspaceId/communications/emails/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/communications/emails/index.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdCommunicationsContactsIndexLazyRoute =
  WorkspaceIdCommunicationsContactsIndexLazyImport.update({
    path: '/$workspaceId/communications/contacts/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/communications/contacts/index.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdProjectsProjectIdReadmeLazyRoute =
  WorkspaceIdProjectsProjectIdReadmeLazyImport.update({
    path: '/$workspaceId/projects/$projectId/readme',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/projects/$projectId/readme.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdProjectsProjectIdGuidelinesLazyRoute =
  WorkspaceIdProjectsProjectIdGuidelinesLazyImport.update({
    path: '/$workspaceId/projects/$projectId/guidelines',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/projects/$projectId/guidelines.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdProjectsProjectIdDocsLazyRoute =
  WorkspaceIdProjectsProjectIdDocsLazyImport.update({
    path: '/$workspaceId/projects/$projectId/docs',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/projects/$projectId/docs.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdProjectsProjectIdAnalyticsLazyRoute =
  WorkspaceIdProjectsProjectIdAnalyticsLazyImport.update({
    path: '/$workspaceId/projects/$projectId/analytics',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/projects/$projectId/analytics.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdFormsFormIdResponsesLazyRoute =
  WorkspaceIdFormsFormIdResponsesLazyImport.update({
    path: '/$workspaceId/forms/$formId/responses',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/forms/$formId/responses.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdFormsFormIdFillLazyRoute =
  WorkspaceIdFormsFormIdFillLazyImport.update({
    path: '/$workspaceId/forms/$formId/fill',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/forms/$formId/fill.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdFormsFormIdAnalyticsLazyRoute =
  WorkspaceIdFormsFormIdAnalyticsLazyImport.update({
    path: '/$workspaceId/forms/$formId/analytics',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/forms/$formId/analytics.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdDashboardsDashboardIdDesignerLazyRoute =
  WorkspaceIdDashboardsDashboardIdDesignerLazyImport.update({
    path: '/$workspaceId/dashboards/$dashboardId/designer',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/dashboards/$dashboardId/designer.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdCommunicationsEmailsTemplatesLazyRoute =
  WorkspaceIdCommunicationsEmailsTemplatesLazyImport.update({
    path: '/$workspaceId/communications/emails/templates',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/communications/emails/templates.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdCommunicationsEmailsDesignerLazyRoute =
  WorkspaceIdCommunicationsEmailsDesignerLazyImport.update({
    path: '/$workspaceId/communications/emails/designer',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/$workspaceId/communications/emails/designer.lazy').then(
      (d) => d.Route,
    ),
  )

const WorkspaceIdFormsFormIdPreviewRoute =
  WorkspaceIdFormsFormIdPreviewImport.update({
    path: '/$workspaceId/forms/$formId/preview',
    getParentRoute: () => rootRoute,
  } as any)

const WorkspaceIdProjectsProjectIdTasksTaskIdIndexLazyRoute =
  WorkspaceIdProjectsProjectIdTasksTaskIdIndexLazyImport.update({
    path: '/$workspaceId/projects/$projectId/tasks/$taskId/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import(
      './routes/$workspaceId/projects/$projectId/tasks/$taskId/index.lazy'
    ).then((d) => d.Route),
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
    '/auth/choose-workspace': {
      preLoaderRoute: typeof AuthChooseWorkspaceImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/automations/designer': {
      preLoaderRoute: typeof WorkspaceIdAutomationsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/forms/designer': {
      preLoaderRoute: typeof WorkspaceIdFormsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/automations/': {
      preLoaderRoute: typeof WorkspaceIdAutomationsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/dashboards/': {
      preLoaderRoute: typeof WorkspaceIdDashboardsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/forms/': {
      preLoaderRoute: typeof WorkspaceIdFormsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/projects/': {
      preLoaderRoute: typeof WorkspaceIdProjectsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/forms/$formId/preview': {
      preLoaderRoute: typeof WorkspaceIdFormsFormIdPreviewImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/communications/emails/designer': {
      preLoaderRoute: typeof WorkspaceIdCommunicationsEmailsDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/communications/emails/templates': {
      preLoaderRoute: typeof WorkspaceIdCommunicationsEmailsTemplatesLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/dashboards/$dashboardId/designer': {
      preLoaderRoute: typeof WorkspaceIdDashboardsDashboardIdDesignerLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/forms/$formId/analytics': {
      preLoaderRoute: typeof WorkspaceIdFormsFormIdAnalyticsLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/forms/$formId/fill': {
      preLoaderRoute: typeof WorkspaceIdFormsFormIdFillLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/forms/$formId/responses': {
      preLoaderRoute: typeof WorkspaceIdFormsFormIdResponsesLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/projects/$projectId/analytics': {
      preLoaderRoute: typeof WorkspaceIdProjectsProjectIdAnalyticsLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/projects/$projectId/docs': {
      preLoaderRoute: typeof WorkspaceIdProjectsProjectIdDocsLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/projects/$projectId/guidelines': {
      preLoaderRoute: typeof WorkspaceIdProjectsProjectIdGuidelinesLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/projects/$projectId/readme': {
      preLoaderRoute: typeof WorkspaceIdProjectsProjectIdReadmeLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/communications/contacts/': {
      preLoaderRoute: typeof WorkspaceIdCommunicationsContactsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/communications/emails/': {
      preLoaderRoute: typeof WorkspaceIdCommunicationsEmailsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/dashboards/$dashboardId/': {
      preLoaderRoute: typeof WorkspaceIdDashboardsDashboardIdIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/projects/$projectId/': {
      preLoaderRoute: typeof WorkspaceIdProjectsProjectIdIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/$workspaceId/projects/$projectId/tasks/$taskId/': {
      preLoaderRoute: typeof WorkspaceIdProjectsProjectIdTasksTaskIdIndexLazyImport
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
  AuthChooseWorkspaceRoute,
  AuthLoginRoute,
  WorkspaceIdAutomationsDesignerLazyRoute,
  WorkspaceIdFormsDesignerLazyRoute,
  WorkspaceIdAutomationsIndexLazyRoute,
  WorkspaceIdDashboardsIndexLazyRoute,
  WorkspaceIdFormsIndexLazyRoute,
  WorkspaceIdProjectsIndexLazyRoute,
  WorkspaceIdFormsFormIdPreviewRoute,
  WorkspaceIdCommunicationsEmailsDesignerLazyRoute,
  WorkspaceIdCommunicationsEmailsTemplatesLazyRoute,
  WorkspaceIdDashboardsDashboardIdDesignerLazyRoute,
  WorkspaceIdFormsFormIdAnalyticsLazyRoute,
  WorkspaceIdFormsFormIdFillLazyRoute,
  WorkspaceIdFormsFormIdResponsesLazyRoute,
  WorkspaceIdProjectsProjectIdAnalyticsLazyRoute,
  WorkspaceIdProjectsProjectIdDocsLazyRoute,
  WorkspaceIdProjectsProjectIdGuidelinesLazyRoute,
  WorkspaceIdProjectsProjectIdReadmeLazyRoute,
  WorkspaceIdCommunicationsContactsIndexLazyRoute,
  WorkspaceIdCommunicationsEmailsIndexLazyRoute,
  WorkspaceIdDashboardsDashboardIdIndexLazyRoute,
  WorkspaceIdProjectsProjectIdIndexLazyRoute,
  WorkspaceIdProjectsProjectIdTasksTaskIdIndexLazyRoute,
])

/* prettier-ignore-end */
