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
        id: 1,
      },

      {
        title: "Doctors",
        icon: "user",
        path: `/doctors`,
        type: "link",
        id: 2,
      },

      {
        title: "Patients",
        icon: "user",
        path: `/patients`,
        type: "link",
        id: 15,
      },
      {
        title: "Medical Records",
        icon: "gallery",
        path: `/medical-records`,
        type: "link",
        id: 14,
      },
      {
        path: `/specialities`,
        icon: "file",
        title: "Specialities",
        type: "link",
        id: 3,
      },

      {
        title: "Appointments",
        icon: "calendar",
        path: `/appointments`,
        type: "link",
        id: 5,
      },
      {
        path: `/departments`,
        icon: "knowledgebase",
        title: "Departments",
        type: "link",
        id: 4,
      },
      {
        title: "Slot Management",
        icon: "chat",
        type: "sub",
        active: false,
        id: 6,
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
        id: 13,
      },
      {
        title: "Technologies",
        icon: "project",
        type: "link",
        path: `/technologies`,
        id: 7,
      },
      {
        path: `/blog`,
        icon: "blog",
        title: "Blog",
        type: "link",
        id: 10,
      },
      {
        path: `/testimonials`,
        icon: "chat",
        title: "Testimonials",
        type: "link",
        id: 9,
      },
      {
        path: `/roles-permissions`,
        icon: "user",
        title: "Roles & Permissions",
        type: "link",
        id: 11,
      },
    ],
  },
];
