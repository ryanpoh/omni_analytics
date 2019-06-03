#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "RyaniPhone";
const char* password = "kw3nyqpickn5m";
const char* host = "limitless-beach-13561.herokuapp.com/";
const char* fullHost = "http://limitless-beach-13561.herokuapp.com/api/update";
//String PostData = "employeeID=2222&lotId=200&lotSize=M&lotQuantity=23&processId=201&timeTaken=13&day=12&month=12&year=2019&startTime=1350";


void setup()
{
  Serial.begin(115200);

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void loop() {

  String IncomingString = "";
  String bufferedPostData = "";
  boolean StringReady = false;
  

  while (Serial.available()) {
//    Serial.println("From ESP8266: PACKET DETECTED");
    IncomingString = Serial.readString();
    bufferedPostData = IncomingString;
    StringReady = true;
//    if (IncomingString == "GET READY") {
//      bufferedPostData = IncomingString;
//      StringReady = true;
//    }
  }

  if (StringReady) {
//    Serial.println("\n SKYLINE DATABASE UPDATE SUCCESSSFUL");
    HTTPClient http;
    http.begin(fullHost);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    http.addHeader("Content-Control", "no-cache");
    http.addHeader("Accept", "*/*");
    http.addHeader("accept-encoding", "gzip, deflate");
    http.addHeader("Connection", "keep-alive");

    int httpCode = http.POST(bufferedPostData);
    String payload = http.getString(); //Get the response payload 
//    Serial.println(httpCode);
//    Serial.println("From Skyline server: \n" + payload +"\n\n");

    http.end();
    Serial.println("\n SKYLINE DATABASE UPDATE SUCCESSSFUL");
  }

}
