import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import LogoutPage from '../views/LogoutPage.vue'
import CatalogPage from '../views/CatalogPage.vue'
import InventoryManagementPage from '../views/InventoryManagementPage.vue'
import ServerManagementPage from '../views/ServerManagementPage.vue'
import ReportsPage from '../views/ReportsPage.vue'
import NotificationSettingsPage from '../views/NotificationSettingsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutPage
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: CatalogPage
  },
  {
    path: '/inventoryManagement',
    name: 'InventoryManagement',
    component: InventoryManagementPage
  },
  {
    path: '/serverManagement',
    name: 'ServerManagement',
    component: ServerManagementPage
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsPage
  },
  {
    path: '/notificationSettings',
    name: 'NotificationSettings',
    component: NotificationSettingsPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
