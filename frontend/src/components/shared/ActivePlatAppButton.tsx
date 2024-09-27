'use client'
import { Switch } from '@/components/ui/switch'
import React, { useState } from 'react'




const ActivePlatAppButton = ({ appId, handleActivePlatApp, handleUnActivePlatApp }: { appId: string, handleActivePlatApp:(appId:string) => void,handleUnActivePlatApp:(appId:string) => void  }) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
  
    const handleSwitchChecked = (checked: boolean) => {
      setIsChecked(checked);
  
      if (checked) {
        console.log('checked true', appId);
        handleActivePlatApp(appId);
      } else {
        console.log('checked false', appId);
        handleUnActivePlatApp(appId)
      }
    };
  
    return (
      <>
        <Switch checked={isChecked} onClick={() => handleSwitchChecked(!isChecked)} />
      </>
    );
  };
  
  export default ActivePlatAppButton;