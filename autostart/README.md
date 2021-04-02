# Systemd unit service
## How to install 
Copy **timestampsdr.service** to **/etc/systemd/system**

    sudo cp ./timestampsdr.service /etc/systemd/system
    
Modify file **timestampsdr.service** according to your settings

    sudo nano /etc/systemd/system/timestampsdr.service  

Turns the service on, on the next reboot

    sudo systemctl enable timestampsdr.service
Start the service

    sudo systemctl start timestampsdr.service

## Useful commands
Logs can be viewed as follows

    journalctl -u timestampsdr
Follow all logs 

    journalctl -f -u timestampsdr
Stop the service

    sudo systemctl stop timestampsdr
Turns the service off on the next reboot

    sudo systemctl disable timestampsdr.service

