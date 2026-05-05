import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import useMQTT from '../hooks/useMQTT';

function LigaLeds() {
    const { ligarLed, desligarLed, isConnected } = useMQTT();
    const [ledStates, setLedStates] = useState(Array(8).fill(false));

    const handleLedChange = (index) => (event) => {
        const isChecked = event.target.checked;
        setLedStates(prev => {
            const newStates = [...prev];
            newStates[index] = isChecked;
            return newStates;
        });
        
        if (isChecked) {
            ligarLed(index);
        } else {
            desligarLed(index);
        }
    };

    return (
        <div className="p-6 mt-8 bg-white border-pink-600 border-solid border-[10px] rounded-[32px] max-w-[1099px] mx-auto">
            <h3 className="text-3xl font-bold text-center text-amber-950 mb-6">Controle de LEDs</h3>
            
            <div className={`text-center mb-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? '💡 LEDs controláveis' : '⚠️ LEDs indisponíveis'}
            </div>
            
            <div className="grid grid-cols-4 gap-4 justify-items-center">
                {[0,1,2,3,4,5,6,7].map(i => (
                    <div key={i} className="flex flex-col items-center">
                        <span className="text-sm font-semibold mb-1 text-amber-800">LED {i+1}</span>
                        <Checkbox
                            checked={ledStates[i]}
                            onChange={handleLedChange(i)}
                            disabled={!isConnected}
                            sx={{
                                color: '#D96204',
                                '&.Mui-checked': {
                                    color: '#FF950C',
                                },
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LigaLeds;