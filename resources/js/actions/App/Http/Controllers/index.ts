import Api from './Api'
import WorkController from './WorkController'
import FinanceController from './FinanceController'
import ServiceRequestController from './ServiceRequestController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    Api: Object.assign(Api, Api),
WorkController: Object.assign(WorkController, WorkController),
FinanceController: Object.assign(FinanceController, FinanceController),
ServiceRequestController: Object.assign(ServiceRequestController, ServiceRequestController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers