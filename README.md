# zigbee_siren_TZE200_nlrfgpny
This is the external converter file to support zigbee siren _TZE200_nlrfgpny. 

Credit: 
This file is not my contribution, it is from discussion: https://github.com/Koenkk/zigbee2mqtt/discussions/17325 .
 - exico91
 - ParalaX002
 - jakubjakubik
 - (Feel free to add more creditors)



I use it with zigbee2mqtt 1.30.2.


Usage: 

    download the file to the folder same as configuration.yaml file. 
    
    Add the below lines in zigbee2mqtt configuration.yaml file


== Zigbee2MQTT configuration.yaml ==
```json
external_converters:
  - zigbee_siren_TZE200_nlrfgpny.js
```


melodys:
 - melody1: Wu Ri, Wu Ri ...
 - melody2: Kinds of air raid siren
 - melody3: Wow, Wow (UK burglary siren?)
   
Another Converter (by tm81):    https://pastes.io/ymgizsqoyp



