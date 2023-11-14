#include <SPI.h>
#include <MFRC522.h>
 
#define SS_PIN 10
#define RST_PIN 6
#define LG_PIN 4
MFRC522 mfrc522(SS_PIN, RST_PIN);

#define HANDSHAKE 'A'
#define ACCEPT 'B'
 
void connect()
{
  char *accept;
  uint8_t flash = LOW;
  while (Serial.available() <= 0)
  {
    flash = (flash == HIGH) ? LOW : HIGH;
    digitalWrite(LG_PIN, flash);

    Serial.print(HANDSHAKE);
    delay(300);
  }

  Serial.readBytes(accept, 1);
  if (*accept != ACCEPT) { connect(); }
}

void setup() 
{
  /* Initialize Hardware */
  pinMode(LG_PIN, OUTPUT);
  Serial.begin(9600);
  while (!Serial);

  /* Connect to Application */
  connect();

  /* Initialize Scanner Hardware */
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop()
{
  /* Signal That Read Is Available */
  digitalWrite(LG_PIN, HIGH);

  /* Wait For Card To Be Presented */
  if (!(mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial())) 
  {
    return;
  }

  /* Signal That Read Is Occuring */
  digitalWrite(LG_PIN, LOW);

  /* Read Card UID And Send It */
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }

  /* Line Terminator */
  Serial.print("\r\n");
  delay(3000);
} 