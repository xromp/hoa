/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                      pageTitle => Display title besides breadcrumb
                    }
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Router from "vue-router";
import auth from "@/auth/authService";

import firebase from "firebase/app";
import "firebase/auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "",
      component: () => import("./layouts/main/Main.vue"),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: "/",
          redirect: "/login"
        },
        {
          path: "/dashboard/analytics",
          name: "dashboard-analytics",
          component: () =>
            import("./views/pages/dashboard/DashboardAnalytics.vue"),
          meta: {
            slug: "dashboard-analytics",
            rule: "admin"
          }
        },
        {
          path: "/dashboard/vendor",
          name: "dashboard-vendor",
          component: () =>
            import("./views/pages/dashboard/DashboardVendor.vue"),
          meta: {
            slug: "dashboard-vendor",
            rule: "admin"
          }
        },

        // =============================================================================
        // Application Routes
        // =============================================================================
        // {
        //   path: '/users/user-list',
        //   name: 'app-user-list',
        //   component: () => import('@/views/pages/user/list/List.vue'),
        //   meta: {
        //     slug: 'user-list',
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'User' },
        //       { title: 'List', active: true }
        //     ],
        //     pageTitle: 'User List',
        //     rule: 'admin'
        //   }
        // },

        //MANAGEMENT
        {
          path: "/managements/list",
          name: "app-management-list",
          component: () => import("@/views/pages/management/view/View.vue"),
          meta: {
            slug: "management-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Management", url: "/managements/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Management",
            rule: "admin"
          }
        },

        //PARENT ORGANIZATION
        {
          path: "/parentorg/list",
          name: "app-portfolio-list",
          component: () => import("@/views/pages/portfolio/list/List.vue"),
          meta: {
            slug: "portfolio-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Parent Organization", url: "/parentorg/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Parent Organization List",
            rule: "admin"
          }
        },
        {
          path: "/parentorg/view/:viewId",
          name: "app-portfolio-view",
          component: () => import("@/views/pages/portfolio/view/View.vue"),
          meta: {
            slug: "portfolio-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Parent Organization", url: "/parentorg/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Parent Organization View",
            rule: "admin"
          }
        },
        {
          path: "/parentorg/edit/:editId",
          name: "app-portfolio-edit",
          component: () => import("@/views/pages/portfolio/edit/Edit.vue"),
          meta: {
            slug: "portfolio-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Parent Organization", url: "/parentorg/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Parent Organization Edit",
            rule: "admin"
          }
        },
        {
          path: "/parentorg/new",
          name: "app-portfolio-new",
          component: () => import("@/views/pages/portfolio/new/New.vue"),
          meta: {
            slug: "portfolio-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Parent Organization", url: "/parentorg/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Parent Organization New",
            rule: "admin"
          }
        },

        //PROPERTY
        {
          path: "/properties/list",
          name: "app-property-list",
          component: () => import("@/views/pages/property/list/List.vue"),
          meta: {
            slug: "property-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Property", url: null },
              { title: "List", active: true }
            ],
            pageTitle: "Property List",
            rule: "admin"
          }
        },
        {
          path: "/properties/view/:viewId",
          name: "app-property-view",
          component: () => import("@/views/pages/property/view/View.vue"),
          meta: {
            slug: "property-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Property", url: null },
              { title: "View", active: true }
            ],
            pageTitle: "Property View",
            rule: "admin"
          }
        },
        {
          path: "/properties/edit/:editId",
          name: "app-property-edit",
          component: () => import("@/views/pages/property/edit/Edit.vue"),
          meta: {
            slug: "property-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Property", url: null },
              { title: "Edit", active: true }
            ],
            pageTitle: "Property Edit",
            rule: "admin"
          }
        },
        {
          path: "/properties/new",
          name: "app-property-new",
          component: () => import("@/views/pages/property/new/New.vue"),
          meta: {
            slug: "property-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Property", url: null },
              { title: "New", active: true }
            ],
            pageTitle: "Property New",
            rule: "admin"
          }
        },

        //UNITS
        {
          path: "/units/list",
          name: "app-unit-list",
          component: () => import("@/views/pages/unit/list/List.vue"),
          meta: {
            slug: "unit-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Unit", url: "/units/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Unit List",
            rule: "admin"
          }
        },
        {
          path: "/units/view/:viewId",
          name: "app-unit-view",
          component: () => import("@/views/pages/unit/view/View.vue"),
          meta: {
            slug: "unit-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Unit", url: "/units/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Unit View",
            rule: "admin"
          }
        },
        {
          path: "/units/edit/:editId",
          name: "app-unit-edit",
          component: () => import("@/views/pages/unit/edit/Edit.vue"),
          meta: {
            slug: "unit-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Unit", url: "/units/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Unit Edit",
            rule: "admin"
          }
        },
        {
          path: "/units/new",
          name: "app-unit-new",
          component: () => import("@/views/pages/unit/new/New.vue"),
          meta: {
            slug: "unit-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Unit", url: "/units/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Unit New",
            rule: "admin"
          }
        },

        //AMENITIES
        {
          path: "/amenities/list",
          name: "app-amenity-list",
          component: () => import("@/views/pages/amenity/list/List.vue"),
          meta: {
            slug: "amenity-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Amenity", url: null },
              { title: "List", active: true }
            ],
            pageTitle: "Amenity List",
            rule: "admin"
          }
        },
        {
          path: "/amenities/view/:viewId",
          name: "app-amenity-view",
          component: () => import("@/views/pages/amenity/view/View.vue"),
          meta: {
            slug: "amenity-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Amenity", url: null },
              { title: "View", active: true }
            ],
            pageTitle: "Amenity View",
            rule: "admin"
          }
        },
        {
          path: "/amenities/edit/:editId",
          name: "app-amenity-edit",
          component: () => import("@/views/pages/amenity/edit/Edit.vue"),
          meta: {
            slug: "amenity-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Amenity", url: null },
              { title: "Edit", active: true }
            ],
            pageTitle: "Amenity Edit",
            rule: "admin"
          }
        },
        {
          path: "/amenities/new",
          name: "app-amenity-new",
          component: () => import("@/views/pages/amenity/new/New.vue"),
          meta: {
            slug: "amenity-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Amenity", url: null },
              { title: "New", active: true }
            ],
            pageTitle: "Amenity New",
            rule: "admin"
          }
        },

        //ZONES
        {
          path: "/zones/list",
          name: "app-zone-list",
          component: () => import("@/views/pages/zone/list/List.vue"),
          meta: {
            slug: "zone-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Zone", url: "/zones/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Zone List",
            rule: "admin"
          }
        },
        {
          path: "/zones/view/:userId",
          name: "app-zone-view",
          component: () => import("@/views/pages/zone/View.vue"),
          meta: {
            slug: "zone-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Zone", url: "/zones/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Zone View",
            rule: "admin"
          }
        },
        {
          path: "/zones/edit/:userId",
          name: "app-zone-edit",
          component: () => import("@/views/pages/zone/edit/Edit.vue"),
          meta: {
            slug: "zone-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Zone", url: "/zones/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Zone Edit",
            rule: "admin"
          }
        },

        //USER
        {
          path: "/users/list",
          name: "app-user-list",
          component: () => import("@/views/pages/user/list/List.vue"),
          meta: {
            slug: "user-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User", url: "/users/list" },
              { title: "List", active: true }
            ],
            pageTitle: "User List",
            rule: "admin"
          }
        },
        {
          path: "/users/view/:viewId",
          name: "app-user-view",
          component: () => import("@/views/pages/user/view/View.vue"),
          meta: {
            slug: "user-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User", url: "/users/list" },
              { title: "View", active: true }
            ],
            pageTitle: "User View",
            rule: "admin"
          }
        },
        {
          path: "/users/edit/:editId",
          name: "app-user-edit",
          component: () => import("@/views/pages/user/edit/Edit.vue"),
          meta: {
            slug: "user-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User", url: "/users/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "User Edit",
            rule: "admin"
          }
        },
        {
          path: "/users/new",
          name: "app-user-new",
          component: () => import("@/views/pages/user/new/New.vue"),
          meta: {
            slug: "user-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User", url: "/users/list" },
              { title: "New", active: true }
            ],
            pageTitle: "User New",
            rule: "admin"
          }
        },
        //USER PROFILE
        {
          path: "/user-profile/edit/:editId",
          name: "app-user-profile-edit",
          component: () => import("@/views/pages/user_profile/edit/Edit.vue"),
          meta: {
            slug: "user-profile-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User Profile", url: "/user-profile/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "User Profile Edit",
            rule: "admin"
          }
        },
        //USER IMPORT
        {
          path: "/users/import",
          name: "app-user-import",
          component: () => import("@/views/pages/user/import/Import.vue"),
          meta: {
            slug: "user-import",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User", url: "/users/list" },
              { title: "List", active: true }
            ],
            pageTitle: "User Import",
            rule: "admin"
          }
        },

        //USER ROLE
        {
          path: "/user-types/list",
          name: "app-role-list",
          component: () => import("@/views/pages/user_role/list/List.vue"),
          meta: {
            slug: "role-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User Type", url: "/user-types/list" },
              { title: "List", active: true }
            ],
            pageTitle: "User Type List",
            rule: "admin"
          }
        },
        {
          path: "/user-types/view/:viewId",
          name: "app-role-view",
          component: () => import("@/views/pages/user_role/view/View.vue"),
          meta: {
            slug: "role-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User Type", url: "/user-types/list" },
              { title: "View", active: true }
            ],
            pageTitle: "User Type View",
            rule: "admin"
          }
        },
        {
          path: "/user-types/view/sub/:viewId",
          name: "app-role-view",
          component: () => import("@/views/pages/user_role/view/view/View.vue"),
          meta: {
            slug: "role-sub-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User Type", url: "/user-types/list" },
              { title: "View", active: true }
            ],
            pageTitle: "User Type View",
            rule: "admin"
          }
        },
        {
          path: "/user-types/edit/:editId",
          name: "app-role-edit",
          component: () => import("@/views/pages/user_role/edit/Edit.vue"),
          meta: {
            slug: "role-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User Type", url: "/user-types/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "User Type Edit",
            rule: "admin"
          }
        },
        {
          path: "/user-types/new",
          name: "app-role-new",
          component: () => import("@/views/pages/user_role/new/New.vue"),
          meta: {
            slug: "role-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User Type", url: "/user-types/list" },
              { title: "New", active: true }
            ],
            pageTitle: "User Type New",
            rule: "admin"
          }
        },
        {
          path: "/user-types/new/sub/:viewId",
          name: "app-role-new",
          component: () => import("@/views/pages/user_role/view/new/New.vue"),
          meta: {
            slug: "role-sub-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "User Type", url: "/user-types/list" },
              { title: "New", active: true }
            ],
            pageTitle: "User Type New",
            rule: "admin"
          }
        },

        //USER PROFILE
        {
          path: "/modules/list",
          name: "app-module-list",
          component: () => import("@/views/pages/module/edit/Edit.vue"),
          meta: {
            slug: "module-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Module", url: "/module/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Module Edit",
            rule: "admin"
          }
        },

        //USER PERMISSION
        {
          path: "/permissions/list",
          name: "app-permission-list",
          component: () =>
            import("@/views/pages/user_permission/list/List.vue"),
          meta: {
            slug: "permission-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Permission", url: "/permissions/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Permission List",
            rule: "admin"
          }
        },
        {
          path: "/permissions/view/:viewId",
          name: "app-permission-view",
          component: () =>
            import("@/views/pages/user_permission/view/View.vue"),
          meta: {
            slug: "permission-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Permission", url: "/permissions/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Permission View",
            rule: "admin"
          }
        },
        {
          path: "/permissions/edit/:editId",
          name: "app-permission-edit",
          component: () =>
            import("@/views/pages/user_permission/edit/Edit.vue"),
          meta: {
            slug: "permission-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Permission", url: "/permissions/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Permission Edit",
            rule: "admin"
          }
        },
        {
          path: "/permissions/new",
          name: "app-permission-new",
          component: () => import("@/views/pages/user_permission/new/New.vue"),
          meta: {
            slug: "permission-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Permission", url: "/permissions/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Permission New",
            rule: "admin"
          }
        },

        //JOIN REQUEST
        {
          path: "/join-requests/list",
          name: "app-join-request-list",
          component: () => import("@/views/pages/join-request/list/List.vue"),
          meta: {
            slug: "user-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Join Request", url: "/join-requests/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Join Request List",
            rule: "admin"
          }
        },
        {
          path: "/join-requests/view/:userId",
          name: "app-join-request-view",
          component: () => import("@/views/pages/join-request/View.vue"),
          meta: {
            slug: "join-request-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Join Request", url: "/join-requests/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Join Request View",
            rule: "admin"
          }
        },
        {
          path: "/join-requests/edit/:userId",
          name: "app-join-request-edit",
          component: () => import("@/views/pages/join-request/edit/Edit.vue"),
          meta: {
            slug: "join-request-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Join Request", url: "/join-requests/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Join Request Edit",
            rule: "admin"
          }
        },

        //INVITES
        {
          path: "/invites/list",
          name: "app-invite-list",
          component: () => import("@/views/pages/invite/list/List.vue"),
          meta: {
            slug: "invite-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Invite", url: "/invites/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Invite List",
            rule: "admin"
          }
        },
        {
          path: "/invites/view/:userId",
          name: "app-invite-view",
          component: () => import("@/views/pages/invite/View.vue"),
          meta: {
            slug: "invite-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Invite", url: "/invites/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Invite View",
            rule: "admin"
          }
        },
        {
          path: "/invites/edit/:userId",
          name: "app-invite-edit",
          component: () => import("@/views/pages/invite/edit/Edit.vue"),
          meta: {
            slug: "invite-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Invite", url: "/invites/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Invite Edit",
            rule: "admin"
          }
        },

        //NOTIFICATION
        {
          path: "/notifications/list",
          name: "app-notification-list",
          component: () => import("@/views/pages/notification/list/List.vue"),
          meta: {
            slug: "notification-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Notification", url: "/notifications/list" },
              { title: "Outbox", active: true }
            ],
            pageTitle: "Sent Notification",
            rule: "admin"
          }
        },
        {
          path: "/notifications/view/:viewId",
          name: "app-notification-view",
          component: () => import("@/views/pages/notification/view/View.vue"),
          meta: {
            slug: "notification-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Notification", url: "/notifications/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Notification View",
            rule: "admin"
          }
        },
        {
          path: "/notifications/edit/:editId",
          name: "app-notification-edit",
          component: () => import("@/views/pages/notification/edit/Edit.vue"),
          meta: {
            slug: "notification-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Notification", url: "/notifications/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Notification Edit",
            rule: "admin"
          }
        },
        {
          path: "/notifications/new",
          name: "app-notification-new",
          component: () => import("@/views/pages/notification/new/New.vue"),
          meta: {
            slug: "notification-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Notification", url: "/notifications/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Notification New",
            rule: "admin"
          }
        },

        {
          path: "/notifications/received",
          name: "app-notification-received",
          component: () =>
            import("@/views/pages/notificationReceived/list/List.vue"),
          meta: {
            slug: "notification-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Inbox", url: "/notifications/received" },
              { title: "List", active: true }
            ],
            pageTitle: "List",
            rule: "admin"
          }
        },
        {
          path: "/notifications/received/:id",
          name: "app-notification-received-list",
          component: () =>
            import("@/views/pages/notificationReceived/view/View.vue"),
          meta: {
            slug: "notification-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Notification", url: "/notifications/received" },
              { title: "View", active: true }
            ],
            pageTitle: "Notifications View",
            rule: "admin"
          }
        },
        //NOTIFICATION SENT
        {
          path: "/notification-sents/list",
          name: "app-notification-sent-list",
          component: () =>
            import("@/views/pages/notificationSent/list/List.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Sent", url: "/notification-sents/list" },
              { title: "List", active: true }
            ],
            pageTitle: "List",
            rule: "admin"
          }
        },
        {
          path: "/notification-sents/view/:viewId",
          name: "app-notification-sent-view",
          component: () =>
            import("@/views/pages/notificationSent/view/View.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Sent", url: "/notification-sents/list" },
              { title: "View", active: true }
            ],
            pageTitle: "View",
            rule: "admin"
          }
        },
        {
          path: "/notification-sents/edit/:editId",
          name: "app-notification-sent-edit",
          component: () =>
            import("@/views/pages/notificationSent/edit/Edit.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Notification Sent", url: "/notification-sents/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Notification Sent Edit",
            rule: "admin"
          }
        },
        {
          path: "/notification-sents/new",
          name: "app-notification-sent-new",
          component: () => import("@/views/pages/notificationSent/new/New.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Notification Sent", url: "/notification-sents/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Notification Sent New",
            rule: "admin"
          }
        },

        //NOTIFICATION TEMPLATES
        {
          path: "/notification-templates/list",
          name: "app-notification-template-list",
          component: () =>
            import("@/views/pages/notificationTemplate/list/List.vue"),
          meta: {
            slug: "notification-template-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Template", url: "/notification-templates/list" },
              { title: "List", active: true }
            ],
            pageTitle: "List",
            rule: "admin"
          }
        },
        {
          path: "/notification-templates/view/:viewId",
          name: "app-notification-template-view",
          component: () =>
            import("@/views/pages/notificationTemplate/view/View.vue"),
          meta: {
            slug: "notification-template-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Template", url: "/notification-templates/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Template View",
            rule: "admin"
          }
        },
        {
          path: "/notification-templates/edit/:editId",
          name: "app-notification-template-edit",
          component: () =>
            import("@/views/pages/notificationTemplate/edit/Edit.vue"),
          meta: {
            slug: "notification-template-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Template", url: "/notification-templates/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Template Edit",
            rule: "admin"
          }
        },
        {
          path: "/notification-templates/new",
          name: "app-notification-template-new",
          component: () =>
            import("@/views/pages/notificationTemplate/new/New.vue"),
          meta: {
            slug: "notification-template-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Template", url: "/notification-templates/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Template New",
            rule: "admin"
          }
        },

        //RESERVATIONS
        {
          path: "/reservations/list",
          name: "reservation-list",
          component: () => import("./views/pages/reservation/list/List.vue"),
          meta: {
            slug: "reservation-list",
            rule: "admin",
            no_scroll: true
          }
        },
        {
          path: "/reservation/calendar",
          name: "reservation-calendar",
          component: () => import("./views/pages/reservation/Calendar.vue"),
          meta: {
            slug: "reservation-calendar-list",
            rule: "admin",
            no_scroll: true
          }
        },

        //MAINTENANCE WORK ORDER
        {
          path: "/orders/list",
          name: "app-order-list",
          component: () =>
            import("@/views/pages/maintenance_order/list/List.vue"),
          meta: {
            slug: "order-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Maintenance", url: "/orders/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Maintenance List",
            rule: "admin"
          }
        },
        {
          path: "/orders/view/:viewId",
          name: "app-order-view",
          component: () =>
            import("@/views/pages/maintenance_order/view/View.vue"),
          meta: {
            slug: "order-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Maintenance", url: "/orders/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Maintenance View",
            rule: "admin"
          }
        },
        {
          path: "/orders/edit/:editId",
          name: "app-order-edit",
          component: () =>
            import("@/views/pages/maintenance_order/edit/Edit.vue"),
          meta: {
            slug: "order-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Maintenance", url: "/orders/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Maintenance Edit",
            rule: "admin"
          }
        },
        {
          path: "/orders/new",
          name: "app-order-new",
          component: () =>
            import("@/views/pages/maintenance_order/new/New.vue"),
          meta: {
            slug: "order-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Maintenance", url: "/orders/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Maintenance New",
            rule: "admin"
          }
        },

        //MAINTENANCE REQUEST
        {
          path: "/rfp/list",
          name: "app-rfp-list",
          component: () =>
            import("@/views/pages/maintenance_request/list/List.vue"),
          meta: {
            slug: "maintenance-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Request for Proposal", url: "/rfp/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Request for Proposal List",
            rule: "admin"
          }
        },
        {
          path: "/rfp/view/:viewId",
          name: "app-rfp-view",
          component: () =>
            import("@/views/pages/maintenance_request/view/View.vue"),
          meta: {
            slug: "maintenance-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Request for Proposal", url: "/rfp/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Request for Proposal View",
            rule: "admin"
          }
        },
        {
          path: "/rfp/edit/:editId",
          name: "app-rfp-edit",
          component: () =>
            import("@/views/pages/maintenance_request/edit/Edit.vue"),
          meta: {
            slug: "maintenance-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Request for Proposal", url: "/rfp/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Request for Proposal Edit",
            rule: "admin"
          }
        },
        // {
        //   path: '/rfp/new',
        //   name: 'app-rfp-new',
        //   component: () => import('@/views/pages/maintenance_request/new/New.vue'),
        //   meta: {
        //     slug: 'maintenance-create',
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Request for Proposal', url: '/rfp/list'},
        //       { title: 'New', active: true }
        //     ],
        //     pageTitle: 'Request for Proposal New',
        //     rule: 'admin'
        //   }
        // },

        //VENDORS
        {
          path: "/vendors/list",
          name: "app-vendor-list",
          component: () => import("@/views/pages/vendor/list/List.vue"),
          meta: {
            slug: "vendor-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Service Providers", url: "/vendors/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Service Providers List",
            rule: "admin"
          }
        },
        {
          path: "/vendors/view/:viewId",
          name: "app-vendor-view",
          component: () => import("@/views/pages/vendor/view/View.vue"),
          meta: {
            slug: "vendor-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Service Providers", url: "/vendors/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Service Providers View",
            rule: "admin"
          }
        },
        {
          path: "/vendors/edit/:editId",
          name: "app-vendor-edit",
          component: () => import("@/views/pages/vendor/edit/Edit.vue"),
          meta: {
            slug: "vendor-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Service Providers", url: "/vendors/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Service Providers Edit",
            rule: "admin"
          }
        },
        {
          path: "/vendors/new",
          name: "app-vendor-new",
          component: () => import("@/views/pages/vendor/new/New.vue"),
          meta: {
            slug: "vendor-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Service Providers", url: "/vendors/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Service Providers New",
            rule: "admin"
          }
        },

        //THREAD
        {
          path: "/threads/list",
          name: "app-thread-list",
          component: () =>
            import("@/views/pages/maintenance_thread/list/List.vue"),
          meta: {
            slug: "thread-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Thread", url: "/threads/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Thread List",
            rule: "admin"
          }
        },
        {
          path: "/threads/view/:viewId",
          name: "app-thread-view",
          component: () =>
            import("@/views/pages/maintenance_thread/view/View.vue"),
          meta: {
            slug: "thread-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Thread", url: "/threads/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Thread View",
            rule: "admin"
          }
        },
        {
          path: "/threads/edit/:editId",
          name: "app-thread-edit",
          component: () =>
            import("@/views/pages/maintenance_thread/edit/Edit.vue"),
          meta: {
            slug: "thread-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Thread", url: "/threads/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Thread Edit",
            rule: "admin"
          }
        },
        {
          path: "/maintenances/view/:viewId/thread/new",
          name: "app-thread-new",
          component: () =>
            import("@/views/pages/maintenance_thread/new/New.vue"),
          meta: {
            slug: "thread-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Maintenance", url: "/maintenances/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Thread New",
            rule: "admin"
          }
        },

        // EQUIPMENT
        {
          path: "/equipments/list",
          name: "app-equipment-list",
          component: () =>
            import("@/views/pages/maintenance_equipment/list/List.vue"),
          meta: {
            slug: "equipment-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Equipment", url: "/equipments/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Equipment List",
            rule: "admin"
          }
        },
        {
          path: "/equipments/view/:viewId",
          name: "app-equipment-view",
          component: () =>
            import("@/views/pages/maintenance_equipment/view/View.vue"),
          meta: {
            slug: "equipment-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Equipment", url: "/equipments/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Equipment View",
            rule: "admin"
          }
        },
        {
          path: "/equipments/edit/:editId",
          name: "app-equipment-edit",
          component: () =>
            import("@/views/pages/maintenance_equipment/edit/Edit.vue"),
          meta: {
            slug: "equipment-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Equipment", url: "/equipments/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Equipment Edit",
            rule: "admin"
          }
        },
        {
          path: "/equipments/new",
          name: "app-equipment-new",
          component: () =>
            import("@/views/pages/maintenance_equipment/new/New.vue"),
          meta: {
            slug: "equipment-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Equipment", url: "/equipments/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Equipment New",
            rule: "admin"
          }
        },

        // PART
        {
          path: "/parts/list",
          name: "app-part-list",
          component: () =>
            import("@/views/pages/maintenance_part/list/List.vue"),
          meta: {
            slug: "part-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Part", url: "/parts/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Part List",
            rule: "admin"
          }
        },
        {
          path: "/parts/view/:viewId",
          name: "app-part-view",
          component: () =>
            import("@/views/pages/maintenance_part/view/View.vue"),
          meta: {
            slug: "part-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Part", url: "/parts/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Part View",
            rule: "admin"
          }
        },
        {
          path: "/parts/edit/:editId",
          name: "app-part-edit",
          component: () =>
            import("@/views/pages/maintenance_part/edit/Edit.vue"),
          meta: {
            slug: "part-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Part", url: "/parts/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Part Edit",
            rule: "admin"
          }
        },
        {
          path: "/parts/new",
          name: "app-part-new",
          component: () => import("@/views/pages/maintenance_part/new/New.vue"),
          meta: {
            slug: "part-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Part", url: "/parts/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Part New",
            rule: "admin"
          }
        },

        //BILLING
        {
          path: "/billings/list",
          name: "app-billing-list",
          component: () => import("@/views/pages/billing/list/List.vue"),
          meta: {
            slug: "billing-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Billings", url: "/billings/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Billings List",
            rule: "admin"
          }
        },
        {
          path: "/billings/view/:viewId",
          name: "app-billing-view",
          component: () => import("@/views/pages/billing/view/View.vue"),
          meta: {
            slug: "billing-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Billings", url: "/billings/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Billings View",
            rule: "admin"
          }
        },
        {
          path: "/billings/edit/:editId",
          name: "app-billing-edit",
          component: () => import("@/views/pages/billing/edit/Edit.vue"),
          meta: {
            slug: "billing-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Billings", url: "/billings/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Billings Edit",
            rule: "admin"
          }
        },
        {
          path: "/billings/new",
          name: "app-billing-new",
          component: () => import("@/views/pages/billing/new/New.vue"),
          meta: {
            slug: "billing-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Billings", url: "/billings/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Billings New",
            rule: "admin"
          }
        },

        //BILLING TYPE
        {
          path: "/billing-types/list",
          name: "app-billing-types-list",
          component: () => import("@/views/pages/billing_type/list/List.vue"),
          meta: {
            slug: "bill-type-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Billing Type", url: "/billing-types/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Billing Type List",
            rule: "admin"
          }
        },
        {
          path: "/billing-types/view/:viewId",
          name: "app-billing-types-view",
          component: () => import("@/views/pages/billing_type/view/View.vue"),
          meta: {
            slug: "bill-type-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Billing Type", url: "/billing-types/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Billing Type View",
            rule: "admin"
          }
        },
        {
          path: "/billing-types/edit/:editId",
          name: "app-billing-types-edit",
          component: () => import("@/views/pages/billing_type/edit/Edit.vue"),
          meta: {
            slug: "bill-type-update",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Billing Type", url: "/billing-types/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Billing Type Edit",
            rule: "admin"
          }
        },
        {
          path: "/billing-types/new",
          name: "app-billing-types-new",
          component: () => import("@/views/pages/billing_type/new/New.vue"),
          meta: {
            slug: "bill-type-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Billing Type", url: "/billing-types/list" },
              { title: "New", active: true }
            ],
            pageTitle: "Billing Type New",
            rule: "admin"
          }
        },
        // File Manager
        {
          path: "files/list",
          name: "app-file-manager-list",
          component: () => import("@/views/pages/file-manager/list/List.vue"),
          meta: {
            slug: "file-manager-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "File Manager", url: "files", active: true }
            ],
            pageTitle: "File Manager",
            rule: "admin"
          }
        },
        {
          path: "files/new",
          name: "app-file-manager-new",
          component: () => import("@/views/pages/file-manager/new/New.vue"),
          meta: {
            slug: "file-manager-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "File Manager", url: "list", active: true },
              { title: "New", active: true }
            ],
            pageTitle: `File Manager`,
            rule: "admin"
          }
        },
        {
          path: "files/:id",
          name: "app-file-manager-view",
          component: () => import("@/views/pages/file-manager/view/View.vue"),
          meta: {
            slug: "file-manager-create",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "File Manager", url: "list" },
              { title: "Folder", active: true }
            ],
            pageTitle: `File Manager`,
            rule: "admin"
          }
        },

        //DOCUMENTS
        // {
        //   path: '/documents/list',
        //   name: 'app-document-list',
        //   component: () => import('@/views/pages/document/List.vue'),
        //   meta: {
        //     slug: 'document-list',
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Documents', url: '/documents/list'},
        //       { title: 'List', active: true }
        //     ],
        //     pageTitle: 'Documents List',
        //     rule: 'admin'
        //   }
        // },

        //INCIDENT REPORTS
        // {
        //   path: '/incidentReport/list',
        //   name: 'app-incidentReport-list',
        //   component: () => import('@/views/pages/incidentReport/list/List.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Incident Reports', url: '/incidentReport/list'},
        //       { title: 'List', active: true }
        //     ],
        //     pageTitle: 'Incident Reports List',
        //     rule: 'admin'
        //   }
        // },
        // {
        //   path: '/incidentReport/view/:viewId',
        //   name: 'app-incidentReport-view',
        //   component: () => import('@/views/pages/incidentReport/view/View.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Incident Reports', url: '/incidentReport/list'},
        //       { title: 'View', active: true }
        //     ],
        //     pageTitle: 'Incident Reports View',
        //     rule: 'admin'
        //   }
        // },
        // {
        //   path: '/incidentReport/edit/:editId',
        //   name: 'app-incidentReport-edit',
        //   component: () => import('@/views/pages/incidentReport/edit/Edit.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Incident Reports', url: '/incidentReport/list'},
        //       { title: 'Edit', active: true }
        //     ],
        //     pageTitle: 'Incident Reports Edit',
        //     rule: 'admin'
        //   }
        // },
        // {
        //   path: '/incidentReport/new',
        //   name: 'app-incidentReport-new',
        //   component: () => import('@/views/pages/incidentReport/new/New.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Incident Reports', url: '/incidentReport/list'},
        //       { title: 'New', active: true }
        //     ],
        //     pageTitle: 'Incident Reports New',
        //     rule: 'admin'
        //   }
        // },

        //RED FLAGS
        // {
        //   path: '/redFlags/list',
        //   name: 'app-redFlags-list',
        //   component: () => import('@/views/pages/redFlags/list/List.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Red Flags', url: '/redFlags/list'},
        //       { title: 'List', active: true }
        //     ],
        //     pageTitle: 'Red Flags List',
        //     rule: 'admin'
        //   }
        // },
        // {
        //   path: '/redFlags/view/:viewId',
        //   name: 'app-redFlags-view',
        //   component: () => import('@/views/pages/redFlags/view/View.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Red Flags', url: '/redFlags/list'},
        //       { title: 'View', active: true }
        //     ],
        //     pageTitle: 'Red Flags View',
        //     rule: 'admin'
        //   }
        // },
        // {
        //   path: '/redFlags/edit/:editId',
        //   name: 'app-redFlags-edit',
        //   component: () => import('@/views/pages/redFlags/edit/Edit.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Red Flags', url: '/redFlags/list'},
        //       { title: 'Edit', active: true }
        //     ],
        //     pageTitle: 'Red Flags Edit',
        //     rule: 'admin'
        //   }
        // },
        // {
        //   path: '/redFlags/new',
        //   name: 'app-redFlags-new',
        //   component: () => import('@/views/pages/redFlags/new/New.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Red Flags', url: '/redFlags/list'},
        //       { title: 'New', active: true }
        //     ],
        //     pageTitle: 'Red Flags New',
        //     rule: 'admin'
        //   }
        // },

        //CALIBER CLIENTS
        {
          path: "/caliber/client/list",
          name: "app-caliber-client-list",
          component: () => import("@/views/pages/caliber/client/list/List.vue"),
          meta: {
            slug: "caliber-client-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Clients", url: "/caliber/client/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Clients List",
            rule: "admin"
          }
        },
        {
          path: "/caliber/client/import",
          name: "app-caliber-client-import",
          component: () =>
            import("@/views/pages/caliber/client/new/ImportClientTab.vue"),
          meta: {
            slug: "caliber-client-import",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Clients", url: "/caliber/client/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Clients List",
            rule: "admin"
          }
        },
        {
          path: "/approval/list",
          name: "app-approval-list",
          component: () =>
            import("@/views/pages/caliber/approval/list/List.vue"),
          meta: {
            slug: "approval-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Approvals", url: "/approval/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Approvals",
            rule: "admin"
          }
        },
        {
          path: "/caliber/client/view/:viewId",
          name: "app-caliber-client-view",
          component: () => import("@/views/pages/caliber/client/view/View.vue"),
          meta: {
            slug: "caliber-client-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Clients", url: "/caliber/client/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Clients View",
            rule: "admin"
          }
        },

        //CALIBER CONTACT TRANSACTION
        {
          path: "/caliber/contact-transaction/list",
          name: "app-caliber-contact-transaction-list",
          component: () =>
            import("@/views/pages/caliber/contact-transaction/list/List.vue"),
          meta: {
            slug: "caliber-contact-transaction-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              {
                title: "Contact Transaction",
                url: "/caliber/contact-transaction/list"
              },
              { title: "List", active: true }
            ],
            pageTitle: "Contact Transaction List",
            rule: "admin"
          }
        },
        {
          path: "/caliber/contact-transaction/view/:viewId",
          name: "app-caliber-contact-transaction-view",
          component: () =>
            import("@/views/pages/caliber/contact-transaction/view/View.vue"),
          meta: {
            slug: "caliber-contact-transaction-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              {
                title: "Contact Transaction",
                url: "/caliber/contact-transaction/list"
              },
              { title: "View", active: true }
            ],
            pageTitle: "Contact Transaction View",
            rule: "admin"
          }
        },

        //CALIBER CONTACTS
        {
          path: "/caliber/client/view/:viewId/contact/list",
          name: "app-caliber-contact-list",
          component: () =>
            import("@/views/pages/caliber/contact/list/List.vue"),
          meta: {
            slug: "caliber-contact-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Contacts", url: "/caliber/contact/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Contacts List",
            rule: "admin"
          }
        },
        {
          path: "/caliber/contact/view/:viewId",
          name: "app-caliber-contact-view",
          component: () =>
            import("@/views/pages/caliber/contact/view/View.vue"),
          meta: {
            slug: "caliber-contact-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Contacts", url: "/caliber/contact/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Contacts View",
            rule: "admin"
          }
        },

        //CALIBER REPORT
        {
          path: "/accounting/report",
          name: "app-accounting-reports",
          component: () => import("@/views/pages/caliber/report/Reports.vue"),
          meta: {
            slug: "caliber-report-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Accounting", url: "/", active: true },
              { title: "Report", url: "/accounting/report", active: true }
            ],
            pageTitle: "Report",
            rule: "admin"
          }
        },

        //CALIBER INSIGHT REPORT
        {
          path: "/caliber/report-insight",
          name: "app-accounting-reports",
          component: () => import("@/views/pages/caliber/report/Insight.vue"),
          meta: {
            slug: "caliber-report-list",
            pageTitle: "aXP Transactions",
            rule: "admin"
          }
        },
        //CALIBER INVOICE
        {
          path: "/caliber/invoice/list",
          name: "caliber-invoice-list",
          component: () =>
            import("@/views/pages/caliber/invoice/list/List.vue"),
          meta: {
            slug: "caliber-invoice-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Accounting", url: "/caliber/invoice/list" },
              { title: "Caliber", url: "/caliber/invoice/list" },
              { title: "Invoice", url: "/caliber/invoice/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Caliber Invoice List",
            rule: "admin"
          }
        },
        {
          path: "/caliber/invoice/view/:viewId",
          name: "caliber-invoice-view",
          component: () =>
            import("@/views/pages/caliber/invoice/view/View.vue"),
          meta: {
            slug: "caliber-invoice-read",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Accounting", url: "/caliber/invoice/list" },
              { title: "Caliber", url: "/caliber/invoice/list" },
              { title: "Invoice", url: "/caliber/invoice/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Caliber Invoice View",
            rule: "admin"
          }
        },
        {
          path: "/caliber/financial/:billId",
          name: "caliber-financial-new",
          component: () =>
            import("@/views/pages/caliber/financial/new/New.vue"),
          meta: {
            slug: "caliber-financial-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Accounting", url: "/" },
              { title: "Caliber", url: "/" },
              { title: "Financial", url: "/" },
              { title: "New", active: true }
            ],
            pageTitle: "Caliber Financial New",
            rule: "admin"
          }
        },
        // {
        //   path: '/billings/edit/:editId',
        //   name: 'app-billing-edit',
        //   component: () => import('@/views/pages/billing/edit/Edit.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Billings', url: '/billings/list'},
        //       { title: 'Edit', active: true }
        //     ],
        //     pageTitle: 'Billings Edit',
        //     rule: 'admin'
        //   }
        // },
        // {
        //   path: '/billings/new',
        //   name: 'app-billing-new',
        //   component: () => import('@/views/pages/billing/new/New.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { title: 'Home', url: '/' },
        //       { title: 'Billings', url: '/billings/list'},
        //       { title: 'New', active: true }
        //     ],
        //     pageTitle: 'Billings New',
        //     rule: 'admin'
        //   }
        // },

        //CHAT
        {
          path: "/chat",
          name: "app-chat-history",
          component: () => import("@/views/pages/chat/Chat.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Chat", url: "/chat", active: true }
            ],
            pageTitle: "Chat ",
            rule: "admin"
          }
        },

        //SUPPORT
        {
          path: "/support/list",
          name: "app-support-list",
          component: () => import("@/views/pages/support/list/List.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Support", url: "/support/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Support List",
            rule: "admin"
          }
        },
        {
          path: "/support/view/:userId",
          name: "app-support-view",
          component: () => import("@/views/pages/support/View.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Support", url: "/support/list" },
              { title: "View", active: true }
            ],
            pageTitle: "Support View",
            rule: "admin"
          }
        },
        {
          path: "/support/edit/:userId",
          name: "app-support-edit",
          component: () => import("@/views/pages/support/edit/Edit.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Support", url: "/support/list" },
              { title: "Edit", active: true }
            ],
            pageTitle: "Support Edit",
            rule: "admin"
          }
        },
        //Analytics
        {
          path: "/analytics/property",
          name: "app-analytics-property-list",
          component: () => import("@/views/pages/analytics/property/view.vue"),
          meta: {
            slug: "analytics-property-list",
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Property", url: "/property/list" },
              { title: "List", active: true }
            ],
            pageTitle: "Property Overview",
            rule: "admin"
          }
        }

        // =============================================================================
        // UI ELEMENTS
        // =============================================================================

        // =============================================================================
        // COMPONENT ROUTES
        // =============================================================================

        // =============================================================================
        // FORMS
        // =============================================================================
        // =============================================================================
        // FORM ELEMENTS
        // =============================================================================

        // =============================================================================
        // Pages Routes
        // =============================================================================

        // =============================================================================
        // CHARTS & MAPS
        // =============================================================================

        // =============================================================================
        // EXTENSIONS
        // =============================================================================
      ]
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: "/callback",
          name: "auth-callback",
          component: () => import("@/views/Callback.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/login",
          name: "page-login",
          component: () => import("@/views/pages/login/Login.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/register",
          name: "page-register",
          component: () => import("@/views/pages/register/Register.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/forgot-password",
          name: "page-forgot-password",
          component: () => import("@/views/pages/general/ForgotPassword.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/reset-password",
          name: "page-reset-password",
          component: () => import("@/views/pages/general/ResetPassword.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/confirm-email",
          name: "page-confirm-email",
          component: () => import("@/views/pages/general/ConfirmEmail.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/lock-screen",
          name: "page-lock-screen",
          component: () => import("@/views/pages/general/LockScreen.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/comingsoon",
          name: "page-coming-soon",
          component: () => import("@/views/pages/general/ComingSoon.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/error-404",
          name: "page-error-404",
          component: () => import("@/views/pages/general/Error404.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/error-500",
          name: "page-error-500",
          component: () => import("@/views/pages/general/Error500.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/not-authorized",
          name: "page-not-authorized",
          component: () => import("@/views/pages/general/NotAuthorized.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          path: "/page-maintenance",
          name: "page-maintenance",
          component: () => import("@/views/pages/general/Maintenance.vue"),
          meta: {
            rule: "editor"
          }
        },
        {
          // path: '/vendor/register/:token',
          path: "/vendor/register",
          name: "app-vendor-register",
          component: () => import("@/views/pages/vendor/register/index.vue"),
          meta: {
            pageTitle: "Register New Vendor",
            rule: "editor"
          }
        },
        {
          path: "/properties/poster/:viewId",
          name: "app-property-poster",
          component: () => import("@/views/pages/property/poster/index.vue"),
          meta: {
            slug: "property-read",
            pageTitle: "Property Poster",
            rule: "admin"
          }
        }
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: "*",
      redirect: "/error-404"
    }
  ]
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged(() => {
    // get firebase current user
    const firebaseCurrentUser = firebase.auth().currentUser;

    // if (
    //     to.path === "/pages/login" ||
    //     to.path === "/pages/forgot-password" ||
    //     to.path === "/pages/error-404" ||
    //     to.path === "/pages/error-500" ||
    //     to.path === "/pages/register" ||
    //     to.path === "/callback" ||
    //     to.path === "/pages/comingsoon" ||
    //     (auth.isAuthenticated() || firebaseCurrentUser)
    // ) {
    //     return next();
    // }

    // If auth required, check login. If login fails redirect to login page
    if (to.meta.authRequired) {
      if (!(auth.isAuthenticated() || firebaseCurrentUser)) {
        router.push({ path: "/pages/login", query: { to: to.path } });
      }
    }

    return next();
    // Specify the current path as the customState parameter, meaning it
    // will be returned to the application after auth
    // auth.login({ target: to.path });
  });
});

export default router;
