export const WHATSAPP_PHONE_NUMBER = "212649680033";

export const createWhatsAppMessage = ({
  name,
  price,
  size,
  quantity,
  color,
  productUrl,
}: {
  name: string;
  price: number | string;
  size: string;
  quantity: number;
  color?: string;
  productUrl?: string;
}) => {
  const priceText =
    typeof price === "number" ? price.toFixed(2) : String(price);
  const lines = [
    "Bonjour, je souhaite commander ce produit :",
    `Produit : ${name}`,
    `Prix : ${priceText}`,
    `Taille : ${size}`,
    `Quantité : ${quantity}`,
  ];

  if (color) {
    lines.splice(4, 0, `Couleur : ${color}`);
  }

  if (productUrl) {
    lines.push(``, `Lien produit : ${productUrl}`);
  }

  lines.push("", "Merci.");
  return lines.join("\n");
};

export const createWhatsAppLink = (
  message: string,
  phone = WHATSAPP_PHONE_NUMBER,
) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
