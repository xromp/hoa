/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default [
  // {
  //   url: "/apps/email",
  //   name: "Email",
  //   slug: "email",
  //   icon: "MailIcon",
  //   i18n: "Email",
  // },
  {
    url: null,
    name: "Dashboard",
    type: "dropdown",
    // tag: '2',
    tagColor: "primary",
    icon: "HomeIcon",
    i18n: "Dashboard",
    submenu: [
      {
        url: "/dashboard/analytics",
        name: "Analytics",
        slug: "dashboard-analytics-list",
        i18n: "Analytics",
        isDisabled: false
      }
      // {
      //   url: '/dashboard/vendor',
      //   name: 'Analytics - SP',
      //   slug: 'dashboard-vendor',
      //   i18n: 'Analytics - SP'
      // }
    ]
  },
  {
    header: "Apps",
    icon: "PackageIcon",
    i18n: "Apps",
    items: [
      {
        url: null,
        name: "Administration",
        icon: "CodesandboxIcon",
        i18n: "Administration",
        slug: "management-list",
        submenu: [
          {
            url: "/properties/view/ref",
            slug: "property-list",
            name: "Property Preference",
            icon: "",
            i18n: "Property Preference"
          },
          {
            url: "/managements/list",
            slug: "management-list",
            name: "Approver",
            icon: "",
            i18n: "Approver"
          },
          {
            url: "/billing-types/list",
            slug: "bill-type-list",
            name: "Billing Type",
            icon: "",
            i18n: "Billing Type"
          },
          {
            url: "/units/list",
            slug: "unit-list",
            name: "Units",
            icon: "",
            i18n: "Units"
          },
          {
            url: "/amenities/list",
            slug: "amenity-list",
            name: "Amenities",
            icon: "",
            i18n: "Amenities"
          },
          {
            url: "/zones/list",
            slug: "zone-list",
            name: "Zones",
            icon: "",
            i18n: "Zones"
          }
        ]
      },
      {
        url: "/parentorg/list",
        name: "Parent Organizations",
        icon: "ArchiveIcon",
        i18n: "Parent Organizations",
        slug: "portfolio-list"
      },
      // {
      //   url: null,
      //   name: 'Properties',
      //   icon: 'HomeIcon',
      //   i18n: 'Properties',
      //   submenu: [
      //     {
      //       url: '/properties/view/ref',
      //       slug: 'property-list',
      //       name: 'Preference',
      //       icon: '',
      //       i18n: 'Preference'
      //     },
      //     {
      //       url: '/units/list',
      //       slug: 'unit-list',
      //       name: 'Units',
      //       icon: '',
      //       i18n: 'Units',
      //     },
      //     {
      //       url: '/amenities/list',
      //       slug: 'amenity-list',
      //       name: 'Amenities',
      //       icon: '',
      //       i18n: 'Amenities',
      //     },
      //     {
      //       url: '/zones/list',
      //       slug: 'zone-list',
      //       name: 'Zones',
      //       icon: '',
      //       i18n: 'Zones',
      //     }
      //   ]
      // },
      {
        url: null,
        name: "Users",
        icon: "UserIcon",
        i18n: "Users",
        isDisabled: false,
        submenu: [
          {
            url: "/users/list",
            name: "User List",
            icon: "",
            slug: "user-list",
            i18n: "User List"
          },
          {
            url: "/user-types/list",
            name: "User Types",
            icon: "",
            slug: "role-list",
            i18n: "User Types"
          },
          {
            url: "/modules/list",
            name: "Modules",
            icon: "",
            slug: "module-list",
            i18n: "Modules"
          },
          {
            url: "/users/achived",
            name: "Archived",
            icon: "",
            slug: "role-list",
            i18n: "Archived",
            isDisabled: true
          }
          // {
          //   url: '/permissions/list',
          //   name: 'Permission',
          //   icon: '',
          //   slug: '',
          //   i18n: 'Permission'
          // },
          // {
          //   url: '/join-requests/list/',
          //   name: 'Join Request',
          //   icon: '',
          //   slug: '',
          //   i18n: 'Join Request'
          // },
          // {
          //   url: '/invites/list/',
          //   name: 'Invite',
          //   icon: '',
          //   slug: '',
          //   i18n: 'Invite'
          // },
        ]
      },
      {
        url: null,
        name: "Join Request",
        icon: "UserIcon",
        i18n: "Join Request",
        isDisabled: false,
        submenu: [
          {
            url: "/join-requests/list",
            name: "List",
            icon: "",
            slug: "user-list",
            i18n: "List"
          }
        ]
      },
      {
        url: null,
        name: "Notifications",
        icon: "BellIcon",
        i18n: "Notifications",
        submenu: [
          {
            url: "/notifications/received",
            name: "Inbox",
            icon: "",
            slug: "notification-list",
            i18n: "Inbox"
          },
          {
            url: "/notification-sents/list",
            name: "Sent",
            icon: "",
            slug: "notification-sent-list",
            i18n: "Sent"
          },
          {
            url: "/notification-templates/list",
            name: "Templates",
            icon: "",
            slug: "notification-template-list",
            i18n: "Templates"
          },
          {
            url: "/no-url-yet/",
            name: "Archived",
            icon: "",
            slug: "notification-template-list",
            i18n: "Archived",
            isDisabled: true
          }
        ]
      },
      {
        url: null,
        name: "Reservations",
        icon: "CalendarIcon",
        i18n: "Reservations",
        submenu: [
          {
            url: "/reservation/calendar/",
            name: "Calendar",
            icon: "",
            slug: "reservation-calendar-list",
            i18n: "Calendar"
          },
          {
            url: "/reservations/list/",
            name: "List",
            icon: "",
            slug: "reservation-list",
            i18n: "List"
          },
          {
            url: "/amenities/new",
            name: "Create Amenity",
            icon: "",
            slug: "amenity-list",
            i18n: "Create Amenity"
          }
        ]
      },
      // {
      //   url: '/reservation/calendar/',
      //   name: 'Reservations',
      //   icon: 'CalendarIcon',
      //   i18n: 'Reservations',
      //   slug: 'reservation-list',
      // },
      {
        url: null,
        name: "Maintenance",
        icon: "ToolIcon",
        i18n: "Maintenance",
        submenu: [
          {
            url: "/orders/list",
            name: "Maintenance List",
            icon: "",
            slug: "order-list",
            i18n: "List"
          },
          {
            url: "/rfp/list",
            name: "RFP",
            icon: "",
            slug: "maintenance-list",
            i18n: "RFP"
          },
          {
            url: "/vendors/list",
            name: "Service Providers",
            icon: "",
            slug: "vendor-list",
            i18n: "Service Providers"
          },
          // {
          //   url: '/threads/list',
          //   name: 'Threads',
          //   icon: '',
          //   slug: '',
          //   i18n: 'Threads'
          // },
          {
            url: "/equipments/list",
            name: "Equipments",
            icon: "",
            slug: "equipment-list",
            i18n: "Equipments"
          },
          {
            url: "/parts/list",
            name: "Parts",
            icon: "",
            slug: "part-list",
            i18n: "Parts"
          }
        ]
      },
      /*   {
        url: null,
        name: 'Billing',
        icon: 'DollarSignIcon',
        i18n: 'Billing',
        submenu: [
          {
            url: '/billings/list/',
            name: 'List',
            icon: '',
            slug: 'billing-list',
            i18n: 'List'
          },          
          // {
          //   url: localStorage.Insight_URL,
          //   name: 'Transaction Reports',
          //   icon: '',
          //   slug: 'caliber-report-list',
          //   i18n: 'Transaction Reports',
          //   type: 'external',
          //   target: '_blank'
          // },
        ]
      }, */
      /* {
        url: null,
        name: 'File Manager',
        icon: 'FolderIcon',
        i18n: 'File Manager',
        submenu: [
          {
            url: '/files/list/',
            name: 'List',
            icon: '',
            slug: 'file-manager-list',
            i18n: 'List'
          },
        ]
      }, */
      // {
      //   url: '/',
      //   name: 'Documents',
      //   icon: 'FolderIcon',
      //   i18n: 'Documents',
      //   submenu: [
      //     {
      //       url: '/documents/list/',
      //       name: 'List',
      //       icon: '',
      //       slug: 'file-manager-list',
      //       i18n: 'List'
      //     }
      //   ]
      // },
      // {
      //   url: '/incidentReport/list',
      //   name: 'Incident Reports',
      //   icon: 'PhoneCallIcon',
      //   i18n: 'Incident Reports',
      // },
      // {
      //   url: '/redFlags/list',
      //   name: 'Red Flags',
      //   icon: 'AlertCircleIcon',
      //   i18n: 'Red Flags',
      // },
      {
        url: "/chat",
        name: "Chat",
        icon: "MessageCircleIcon",
        i18n: "Chat",
        slug: "chat-list"
      },
      {
        url: null,
        name: "Management",
        icon: "EditIcon",
        i18n: "Management",
        // submenu: [
        //   // {
        //   //   url: null,
        //   //   name: 'Menu Level 2.1',
        //   //   i18n: 'MenuLevel2p1'
        //   // },
        //   {
        //     url: null,
        //     name: 'Caliber',
        //     i18n: 'Caliber',
        submenu: [
          {
            url: "/files/list/",
            name: "File Manager",
            icon: "",
            slug: "file-manager-list",
            i18n: "File Manager"
          },
          {
            url: "/billings/list/",
            name: "Billing",
            icon: "",
            slug: "billing-list",
            i18n: "Billing"
          },
          {
            url: "/approval/list",
            name: "Approvals",
            icon: "",
            slug: "approval-list",
            i18n: "Approvals"
          },
          {
            url: "/caliber/client/list",
            name: "Clients",
            icon: "",
            slug: "caliber-client-list",
            i18n: "Clients"
          },
          {
            url: "/caliber/report-insight",
            name: "aXP Transactions",
            icon: "",
            slug: "caliber-report-list",
            i18n: "aXP Transactions"
          }
          // {
          //   url: '/accounting/report',
          //   name: 'Reports',
          //   icon: '',
          //   slug: 'caliber-report-list',
          //   i18n: 'Reports'
          // },
          // {
          //   url: '/caliber/invoice/list',
          //   name: 'Invoices',
          //   icon: '',
          //   slug: 'caliber-invoice-list',
          //   i18n: 'Invoices'
          // },
          // {
          //   url: '/caliber/financial/',
          //   name: 'Financials',
          //   icon: '',
          //   slug: 'caliber-financial-list',
          //   i18n: 'Financials'
          // }
        ]
        //   }
        // ]
      },

      {
        url: null,
        name: "Analytics",
        icon: "CodesandboxIcon",
        i18n: "Analytics",
        slug: "property-list",
        submenu: [
          {
            url: "/analytics/property",
            slug: "property-list",
            name: "Property Overview",
            icon: "",
            i18n: "Property Overview"
          }
        ]
      },

      // {
      //   url: '/support/list',
      //   name: 'Support',
      //   icon: 'SmileIcon',
      //   i18n: 'Support',
      // },
      {
        url: "/login",
        name: "Logout",
        icon: "LogOutIcon",
        i18n: "Logout",
        slug: "logout-list"
      }
    ]
  }
];
