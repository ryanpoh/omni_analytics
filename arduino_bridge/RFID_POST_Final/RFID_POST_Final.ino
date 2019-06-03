
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include "DS3231.h"
#include <SoftwareSerial.h>

#define RX 2
#define TX 3
String AP = "Master";
String PASS = "12345";

char LotID[4] = "";
char LotSize[2] = "";
char LotQuantity[3] = "";
char ProcessID[4] = "";
char TimeTaken[3] = "";
char Day[2] = "";
char Month[2] = "";
char Year[4] = "";
char StartTime[5] = "";
char EmployeeID[4] = "";


int countTrueCommand;
int countTimeCommand;
boolean found = false;
int valSensor = 1;
SoftwareSerial esp8266(RX, TX);
long LastTime = 0;


RTClib RTC;

#define RST_PIN         9
#define SS_PIN          10

MFRC522 rfid(SS_PIN, RST_PIN);

const int RX1 = 2;
const int TX1 = 3;

String uidString;
int Cardchecked = 0;
//long LastTime = 0;

//byte blockcontent[16] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};//all zeros. This can be used to delete a block.
byte readbackblock[18];//This array is used for reading out a block. The MIFARE_Read method requires a buffer that is at least 18 bytes to hold the 16 bytes of a block.

char CardORTag[20];

int LED = 6;
int BuzzPin = 5;

MFRC522::MIFARE_Key key;

void setup() {
  Serial.begin(9600);
  esp8266.begin(115200);
  Wire.begin();
  SPI.begin();      // Initiate  SPI bus
  rfid.PCD_Init();   // Initiate MFRC522

  pinMode(LED,OUTPUT);
  pinMode(BuzzPin,OUTPUT);

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;//keyByte is defined in the "MIFARE_Key" 'struct' definition in the .h file of the library
  }

  Serial.println("1 .Scan the employee card to begin");
}

void loop() {

  rfid.PCD_Init();

  // Used to exit the PCD from its authenticated state.
  rfid.PCD_StopCrypto1(); // VERY IMPORTANT - Add this to start new communication
  while (!rfid.PICC_IsNewCardPresent()) {
    return;
  };
  while (!rfid.PICC_ReadCardSerial()) {
    return;
  };

  // Ensure that employee card and not the tag is scanned first
  readBlock(58, readbackblock);
  CardORTag[0] = readbackblock[0];

  BlinkBuzz();

  if (char(CardORTag[0]) == '1') { // Check the 58th byte to check whether it's a employee card
    //------------------------------------------
    // Read the time from the RTC
    //------------------------------------------
    long int TimeNow = millis();
    DateTime now = RTC.now();

    // Time infomation
    String Hour = String(now.hour());
    if (Hour.length() < 2) {
      Hour = "0" + String(now.hour());
    }
    String Minute = String(now.minute());
    if (Minute.length() < 2) {
      Minute = "0" + String(now.minute());
    }
    String Str_StartTime = Hour + Minute;

    // Date information
    String Str_Day = String(now.day());
    if (Str_Day.length() < 2) {
      Str_Day = "0" + Str_Day;
    }
    String Str_Month = String(now.month());
    if (Str_Month.length() < 2) {
      Str_Month = "0" + Str_Month;
    }
    String Str_Year = String(now.year());
delay(1000);
    //-------------------------------------------
    // Read the employee ID from the CARD
    //-------------------------------------------
    // Read the employee ID from block 62
    String Str_EmployeeID = ReadData(62, 4);

    // Notify user
    BlinkBuzz();

    // Give a time delay of 3 seconds to tap the card
    LastTime = millis();
    while ((millis() - LastTime ) <= 1500) {}

    BlinkBuzz();

    //---------------------------------------------------------
    // Get the process ID from the process card
    //---------------------------------------------------------
    Serial.println("2. Please scan the process card");
    while (char(readbackblock[0]) != '2') {
      rfid.PCD_Init();
      rfid.PCD_StopCrypto1(); // VERY IMPORTANT - Add this to start new communication
      while (!rfid.PICC_IsNewCardPresent()) {};
      while (!rfid.PICC_ReadCardSerial()) {};
      readBlock(58, readbackblock);
      CardORTag[0] = readbackblock[0];
    }

    // Read the process ID from block 62
    String Str_ProcessID= ReadData(62, 4);

    // Notify user
    BlinkBuzz();

    // Give a time delay of 3 seconds to tap the employee
    LastTime = millis();
    while ((millis() - LastTime ) <= 1500) {}

    //------------------------------------------
    // Read the material details from the TAG
    //------------------------------------------
    Serial.println("3. Please scan the tag");
    while (char(readbackblock[0]) != '3') {
      rfid.PCD_Init();
      rfid.PCD_StopCrypto1(); // VERY IMPORTANT - Add this to start new communication
      while (!rfid.PICC_IsNewCardPresent()) {};
      while (!rfid.PICC_ReadCardSerial()) {};
      readBlock(58, readbackblock);
      CardORTag[0] = readbackblock[0];
    }

    // Read the lot ID from block 62
    String Str_LotID = ReadData(62, 4);

    // Read the lot size from block 61
    String Str_LotSize= ReadData(61, 2);

    // Read the lot quantity from block 60
    String Str_LotQuantity= ReadData(60, 3);  

    // Notify the user
    BlinkBuzz();

    LastTime = millis();
    while ((millis() - LastTime ) <= 1500) {}

    //-------------------------------------------
    // Read the employee ID from the CARD to EXIT
    //-------------------------------------------

    long int TimeFinish = millis();
    String Str_TimeTaken = String(abs(TimeFinish - TimeNow) / 1000);

    Serial.println("3. Please tap the employee card to exit");
    // Code to wait for the employee card
    while (char(readbackblock[0]) != '1') {
      rfid.PCD_Init();
      rfid.PCD_StopCrypto1(); // VERY IMPORTANT - Add this to start new communication
      while (!rfid.PICC_IsNewCardPresent()) {};
      while (!rfid.PICC_ReadCardSerial()) {};
      readBlock(58, readbackblock);
      CardORTag[0] = readbackblock[0];
    }

    // Notify user
    BlinkBuzz();

    // Provide a time delay  for the user to scan the RFID tag
    LastTime = millis();
    while ((millis() - LastTime ) <= 1500) {}

    Serial.println("");
    Serial.println("----------------------------------------");

    //------------------------------------------

    Serial.println(" Employee ID : " + Str_EmployeeID);
    Serial.println(" Start time : " + Str_StartTime);
    Serial.println(" Time Taken : " + Str_TimeTaken);
    Serial.println(" Process ID : " + Str_ProcessID);
    Serial.println(" Lot ID : " + Str_LotID);
    Serial.println(" Lot Size : " + Str_LotSize);
    Serial.println(" Lot Quantity : " + Str_LotQuantity);
    Serial.println("");
    

    // Form the string with data in it
    String SendString = "employeeID=" + Str_EmployeeID + "&lotId=" + Str_LotID + "&lotSize=" + Str_LotSize + "&lotQuantity=" + Str_LotQuantity + "&processId=" + Str_ProcessID + "&timeTaken=" + Str_TimeTaken;

    boolean keepSending = true;
    
//    while(keepSending){
//      Serial.println(SendString);
//      esp8266.print(SendString); 
//      delay(2000);
//
//      while(esp8266.available()){
//        String dataFromESP8266 = esp8266.readString();
//        Serial.println(dataFromESP8266);
//        if (dataFromESP8266 == "\n SKYLINE DATABASE UPDATE SUCCESSSFUL"){
//          keepSending = false;
//        }
//      }      
//    }
                      int x=0;
                      while(true){
                            Serial.println(SendString);
                            esp8266.print(SendString); 
                            x++;

                   

                  
                            if(esp8266.available()){
//                              Serial.println("I am here");
                              Serial.println(esp8266.readString());
                              break;
                            } 

                            if(x==1){
                              break;
                            }

                            delay(5000);

                      }


                      

    /*
        /////////////////////////////////////////////////////////
        // Transmit to ESP8266
        /////////////////////////////////////////////////////////
        //    esp8266.print("GET READY");
        delay(50);
        esp8266.print(SendString);
        delay(10000);

        // Provide a time delay  for the user to scan the RFID tag
        //    Serial.println("Waiting for server response");
        //    LastTime = millis();
        //    while ((millis() - LastTime ) <= 3000) {}

        while (esp8266.available()) {
          Serial.println(esp8266.readString());

          //////////////////////////////////////////////////////////
        }

    */

  }

  else {
    Serial.println("Come on lah,employee card first !");
    digitalWrite(LED, HIGH);
    delay(500);
    digitalWrite(LED, LOW);
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}//////////////////////////END OF MAIN LOOP//////////////////////////////////////////////


String ReadData(int Block, int BlockSize) {
  char key[BlockSize] = "";
  readBlock(Block, readbackblock);
  for (int u = 0; u < BlockSize; u++) {
    key[u] = char(readbackblock[u]);
  }
  String Str_key = String(key).substring(0,BlockSize);
  Serial.println(Str_key);
  return Str_key;
}
/////////////////////////////////////////////
int getSensorData() {
  return random(1000); // Replace with
}

// Standard function to notify user
/////////////////////////////////////////////////////////////////////////////////////
void BlinkBuzz() {
  digitalWrite(BuzzPin, HIGH);
  digitalWrite(LED, HIGH);
  delay(300);
  digitalWrite(LED, LOW);
  digitalWrite(BuzzPin, LOW);
}
/////////////////////////////////////////////////////////////////////////////////////

// Function to send to ESP8266
/////////////////////////////////////////////////////////////////////////////////////
void sendCommand(String command, int maxTime, char readReplay[]) {
  Serial.print(countTrueCommand);
  Serial.print(". at command => ");
  Serial.print(command);
  Serial.print(" ");
  while (countTimeCommand < (maxTime * 1))
  {
    esp8266.println(command);//at+cipsend
    if (esp8266.find(readReplay)) //ok
    {
      found = true;
      break;
    }

    countTimeCommand++;
  }

  if (found == true)
  {
    Serial.println("OYI");
    countTrueCommand++;
    countTimeCommand = 0;
  }

  if (found == false)
  {
    Serial.println("Fail");
    countTrueCommand = 0;
    countTimeCommand = 0;
  }

  found = false;
}

////////////////////////////////////////////////////////////////////////

// This function sets up the reader for a new RFID scan
////////////////////////////////////////////////////////
void RFID_Scan_Ready() {

  rfid.PCD_Init();
  // Used to exit the PCD from its authenticated state.
  rfid.PCD_StopCrypto1(); // VERY IMPORTANT - Add this to start new communication

  // Look for new cards
  if ( ! rfid.PICC_IsNewCardPresent())
  {
    return;
  }

  // Select one of the cards
  if ( ! rfid.PICC_ReadCardSerial())
  {
    return;
  }
}
/////////////////////////////////////////////////////////

// Function to read data from RFID cards
/////////////////////////////////////////
int readBlock(int blockNumber, byte arrayAddress[])
{
  int largestModulo4Number = blockNumber / 4 * 4;
  int trailerBlock = largestModulo4Number + 3; //determine trailer block for the sector

  /*****************************************authentication of the desired block for access***********************************************************/
  byte status = rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(rfid.uid));
  //byte PCD_Authenticate(byte command, byte blockAddr, MIFARE_Key *key, Uid *uid);
  //this method is used to authenticate a certain block for writing or reading
  //command: See enumerations above -> PICC_CMD_MF_AUTH_KEY_A = 0x60 (=1100000),    // this command performs authentication with Key A
  //blockAddr is the number of the block from 0 to 15.
  //MIFARE_Key *key is a pointer to the MIFARE_Key struct defined above, this struct needs to be defined for each block. New cards have all A/B= FF FF FF FF FF FF
  //Uid *uid is a pointer to the UID struct that contains the user ID of the card.
  if (status != MFRC522::STATUS_OK) {
    Serial.print("PCD_Authenticate() failed (read): ");
    //         Serial.println(rfid.GetStatusCodeName(status));
    return 3;//return "3" as error message
  }
  //it appears the authentication needs to be made before every block read/write within a specific sector.
  //If a different sector is being authenticated access to the previous one is lost.


  /*****************************************reading a block***********************************************************/

  byte buffersize = 18;//we need to define a variable with the read buffer size, since the MIFARE_Read method below needs a pointer to the variable that contains the size...
  status = rfid.MIFARE_Read(blockNumber, arrayAddress, &buffersize);//&buffersize is a pointer to the buffersize variable; MIFARE_Read requires a pointer instead of just a number
  if (status != MFRC522::STATUS_OK) {
    Serial.print("MIFARE_read() failed: ");
    //          Serial.println(rfid.GetStatusCodeName(status));
    return 4;//return "4" as error message
  }
  //  Serial.println("block was read");
}


////////////////// CODE GRAVEYARD 👻 /////////////////////////////////

//    rfid.PCD_Init();
//    rfid.PCD_StopCrypto1(); // VERY IMPORTANT - Add this to start new communication
//    while (!rfid.PICC_IsNewCardPresent()) {};
//    while (!rfid.PICC_ReadCardSerial()) {};
