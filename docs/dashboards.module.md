### Dashboards

#### User Story

- Dashboard is a container for widgets
- Widget can be charts or kpis
- Dashboards are shown on the home screen as different tabs [shows only active dashboards]
- Charts and KPIs are different

  - Charts show a certain graph (pie, bar, area etc.)
  - KPIs show a single number (current state) and maybe increase or decrease from previous

- First the user creates an empty dashboard
- Then user creates widgets in it
- On the dashboard design screen, user can drag and drop widgets to rearrange

---

Q. How to create a Chart/KPI ?

- On the dashboard design page, click on the add item button
- Modal opens, select type (Chart or KPI)
- then fill the options for datalabels for widget
- Created

---

#### Developer Story

**KPIs**

- Kpi needs `model`, and `aggregation_type`
- `aggregation_type` have the following options
  - sum
  - count
  - max
  - min
  - mean
  - median
  - mode
