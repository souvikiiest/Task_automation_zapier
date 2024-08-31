import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.avialableTrigger.create({
    data: {
      name: "webhook",
      image:
        "https://seeklogo.com/images/W/webhooks-logo-04229CC4AE-seeklogo.com.png",
    },
  });

  await prisma.avialableActions.createMany({
    data: [
      {
        name: "email",
        image:
          "https://cdn.pixabay.com/photo/2016/06/13/17/30/mail-1454731_640.png",
      },
      {
        name: "send-solana",
        image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
      },
    ],
  });
}

main();
