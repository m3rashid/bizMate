### Dashboards

#### User Story

- Dashboard is a container for widgets and kpis
- Dashboards are shown on the home screen as different tabs [shows only active dashboards]
- Widgets and KPIs are different

  - Widgets show a certain graph (pie, bar, area etc.)
  - KPIs show a single number (current state) and maybe increase or decrease from previous

- First the user creates an empty dashboard
- Then user creates widgets and kpis in it
- On the dashboard design screen, user can drag and drop widgets/kpis to rearrange

---

Q. How to create a Chart/KPI ?

- On the dashboard design page, click on the add item button
- Modal opens, select type (Chart or KPI)
- then fill the options for datalabels for widgets/KPIs
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
