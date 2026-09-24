import ServiceRequestController from './ServiceRequestController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    ServiceRequestController: Object.assign(ServiceRequestController, ServiceRequestController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers