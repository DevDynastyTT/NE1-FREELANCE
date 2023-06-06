import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';

export const AdminNavInfo = [
    {
        title: "Home",
        icon: <HomeIcon />,
        link: "/admin"
    },
    {
        title: "Configurations",
        icon: <WorkIcon />,
        link: "/admin/HomeServices"
    },

    {
        title: "UserInfo",
        icon: <PersonIcon />,
        link: "/admin/UserInfo"
    },
    {
        title: "Exit",
        icon: <ExitToAppIcon />,
        link: "/"
    }
]



