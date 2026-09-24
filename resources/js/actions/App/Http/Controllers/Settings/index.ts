import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import CatalogController from './CatalogController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
SecurityController: Object.assign(SecurityController, SecurityController),
CatalogController: Object.assign(CatalogController, CatalogController),
}

export default Settings