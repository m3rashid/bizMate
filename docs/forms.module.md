### Forms

**TL;DR Functionalities**

- Create forms
- Delete forms
- Edit form details (everything except form body)
- Preview forms
- Export list of forms (as CSV or Excel)
- Fill Forms (with or without login)
- Export Form responses (as CSV or Excel)
- Analytics of form responses

#### Create Forms

- The left sidebar contains the components that can be added to the form
- The middle area is the form editor area
- The right sidebar shows properties of the selected element in the form editor or the overall form settings
- The form overall settings include

  1.  Form Title
  2.  Form Description
  3.  Cancel Text
  4.  Submit Text
  5.  Whether to allow anonymous responses
  6.  Whether to allow multiple responses
  7.  Whether to allow users to edit responses
  8.  Whether to send email notifications on form submission

- Form input components include

  1. Input (Text, Number, Email, Phone, Date, Time, URL etc.)
  2. Toggle Input (Yes/No)
  3. Text Area Input
  4. Rich Text Input
  5. Phone number Input
  6. Single Select Input (select one from the given options)
  7. Radio Input (select one from the given options)

- Other components which can be used to describe form or add extra information

  1. Headings (h1, h2, h3, h4, h5, h6)
  2. Paragraph
  3. Code Block
  4. Image
  5. Link

- The right sidebar contains the properties (props) of the selected element in the form editor
- If no component is selected, the right sidebar contains the form overall settings
- After updating any parameter in the right sidebar, the changes can be saved by clicking on the save button in the bottom section of the right sidebar

- The form designer in the editor area has two views

  1. Designer mode (to create/design the form)
  2. Preview mode (to see how the form will look like)

- Each component can be

  1. added to the form by clicking on them
  2. re-arranged by dragging and dropping in the editor area
  3. deleted by double clicking on the delete icon on the component
  4. selected by double clicking on it
  5. edited by changing the attributes in the right sidebar

- By clicking on the lowest container (the component with the submit & reset buttons), the form overall settings can be edited

---

#### Delete Forms

- Forms are soft deleted, which means that they are not deleted from the database. The `deleted` field is just marked as true for that given record

---

#### Edit Form Details

---

#### Preview forms

- Forms in preview mode cannot be submitted or reset

---

#### Fill Forms (with or without login)

- The following markers are checked

- If form is active
- If the form can be filled by the user
  - If anonymous, the form can be filled by anyone
  - else if the user is logged in, let her fill the form, else deny

---

#### Analytics of form responses

Form analytics are made for the following fields

- Toggle Input
- Single Select Input
- Radio Input
