export const MENUITEMS = [
  {
    menutitle: "",
    menucontent:
      "Dashboard,Doctors,Patients,MedicalRecords,Specialities,Appointments,Departments,Slot Management,AddSlots,ManageSlots,HealthPackages,Technologies,Blog,RolesPermissions",
    Items: [
      {
        title: "Dashboard",
        icon: "home",
        type: "link",
        path: `/dashboard`,
      },

      {
        title: "Doctors",
        icon: "user",
        path: `/doctors`,
        type: "link",
      },

      {
        title: "Patients",
        icon: "user",
        path: `/patients`,
        type: "link",
      },
      {
        title: "Medical Records",
        icon: "gallery",
        path: `/medical-records`,
        type: "link",
      },
      {
        path: `/specialities`,
        icon: "file",
        title: "Specialities",
        type: "link",
      },

      {
        title: "Appointments",
        icon: "calendar",
        path: `/appointments`,
        type: "link",
      },
      {
        path: `/departments`,
        icon: "knowledgebase",
        title: "Departments",
        type: "link",
      },
      {
        title: "Slot Management",
        icon: "chat",
        type: "sub",
        active: false,
        children: [
          {
            path: `/slot-management/add-slots`,
            type: "link",
            title: "Add Slots",
          },
          {
            path: `/slot-management/manage-slots`,
            type: "link",
            title: "Manage Slots",
          },
        ],
      }, ///health-packages
      {
        title: "Health Packages",
        icon: "gallery",
        type: "link",
        path: `/health-packages`,
      },
      {
        title: "Technologies",
        icon: "project",
        type: "link",
        path: `/technologies`,
      },
      {
        path: `/blog`,
        icon: "blog",
        title: "Blog",
        type: "link",
      },
      {
        path: `/testimonials`,
        icon: "chat",
        title: "Testimonials",
        type: "link",
      },
      {
        path: `/roles-permissions`,
        icon: "user",
        title: "Roles & Permissions",
        type: "link",
      },
    ],
  },
];
