import DashboardIcon from '@material-ui/icons/Dashboard';
import BusinessIcon from '@material-ui/icons/Business';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ViewListIcon from '@material-ui/icons/ViewList';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TodayIcon from '@material-ui/icons/Today';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PeopleIcon from '@material-ui/icons/People';
import BrushIcon from '@material-ui/icons/Brush';
import AddIcon from '@material-ui/icons/Add';

export const library = {
  add: (icon, name) => {
    library[name] = icon;
  },
};

library.add(AddIcon, 'muiAdd');
library.add(DeleteIcon, 'muiDelete');
library.add(TodayIcon, 'muiToday');
library.add(ArrowBackIcon, 'muiArrowBack');
library.add(ViewListIcon, 'muiViewList');
library.add(AssignmentIndIcon, 'muiAssignmentInd');
library.add(BusinessIcon, 'muiBusiness');
library.add(DashboardIcon, 'muiDashboard');
library.add(ConfirmationNumberIcon, 'muiConfirmationNumberIcon');
library.add(TransferWithinAStationIcon, 'muiTransferWithinAStationIcon');
library.add(AccountBalanceIcon, 'muiAccountBalanceIcon');
library.add(LocalAtmIcon, 'muiLocalAtmIcon');
library.add(PeopleIcon, 'muiPeopleIcon');
library.add(BrushIcon, 'muiBrushIcon');
