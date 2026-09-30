import Api from './Api'
import DashboardController from './DashboardController'
import WorkController from './WorkController'
import FinanceController from './FinanceController'
import ServiceRequestController from './ServiceRequestController'
import WarehouseExpenseController from './WarehouseExpenseController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    Api: Object.assign(Api, Api),
DashboardController: Object.assign(DashboardController, DashboardController),
WorkController: Object.assign(WorkController, WorkController),
FinanceController: Object.assign(FinanceController, FinanceController),
ServiceRequestController: Object.assign(ServiceRequestController, ServiceRequestController),
WarehouseExpenseController: Object.assign(WarehouseExpenseController, WarehouseExpenseController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers