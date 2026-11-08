# Infos à demander à Yonathan Sonigo

Tout ce qui est marqué « à remplir » ou « à confirmer » sur le site. Où le modifier : entre parenthèses.

## Priorité 1 : avant de partager le lien

1. **Les photos des plats.** Les 10 visuels de plats publiés sur Instagram (pizza thon roquette, pains au saumon, pains pesto mozzarella, quiche aux champignons, sablés, tiramisu, sushis, pizza, deux salades) ont l'aspect d'images générées par IA. Ils sont mis de côté dans `assets/a-verifier/` et **ne sont pas sur le site**. Demander :
   - si ce sont de vraies photos de ses plats (si oui, on les ajoute) ;
   - surtout, de vraies photos au téléphone, en lumière du jour : salades en pots, plats, hallot, tartes, une table de Chabbat dressée, un buffet d'événement (sans visage d'invités).
   Aujourd'hui le site n'utilise que les 2 vraies photos du buffet (reels de mai 2026).
2. **La cacherout.** Confirmer « Mehadrin » et « Beth Din de Marseille » (lu sur son logo), et envoyer une photo du certificat (`public/media/cacherout/` puis `data/site.json` → `certificate`).
3. **La ville et la zone.** Marseille déduit du « Beth Din de Marseille » : à confirmer. Quartiers ou communes livrés, frais et minimum de livraison (`data/config.json` → `delivery`, `locales/*.json` → `footer.areaValue`, FAQ).
4. **L'adresse de retrait** (communiquée seulement à la confirmation, ou affichée ?) (`data/site.json` → `pickupAddress`).

## Priorité 2 : la commande du Chabbat

5. **L'heure limite** : jeudi 20 h est la valeur du cahier des charges (`data/config.json` → `deadline`).
6. **Les créneaux** de retrait et de livraison : jeudi 19 h – 21 h et vendredi 9 h – 13 h par défaut (`data/config.json` → `slots`).
7. **La carte complète et les prix** : relevés sur l'affiche de juin 2026 (salades 4,50 € le pot de 300 ml, plats 19 €, desserts 2,50 €, formules 55 € et 105 €). Toujours valables ? Un plat à 19 €, c'est pour combien de personnes ? Prix des hallot à l'unité ?
8. **Le paiement** : espèces, virement, Lydia, carte ? Veut-il le paiement en ligne (Stripe prêt, désactivé dans `data/config.json` → `payment`) ?

## Priorité 3 : événements et fêtes

9. **Les formules événements** : buffet, repas servi, plateaux ; minimum d'invités ; prix par personne indicatifs.
10. **Les réalisations** : type d'événement, date et nombre d'invités du buffet en photo, et d'autres événements (`data/realisations.json`).
11. **Les menus des fêtes** : Hanouka (le bandeau l'annonce déjà), Pourim, Pessa'h, Chavouot ; reconduction des formules Roch Hachana (75 / 145 / 195 € en 5787) (`data/fetes.json`). Vérifier les dates limites de commande proposées.

## Priorité 4 : confiance et SEO

12. **Son histoire** : depuis quand il cuisine, d'où viennent ses recettes (marocaines ? tunisiennes ?), pour un court paragraphe « Qui est Yonathan ».
13. **De vrais avis clients** (Google, captures WhatsApp avec accord) : `data/avis.json`, la section s'affiche dès le premier avis.
14. **Le logo officiel** en fichier (SVG ou PNG haute définition) : le logo actuel est redessiné d'après ses affiches (`components/Logo.tsx`, `app/icon.svg`).
15. **Fiche Google Business Profile** : en créer une (« Traiteur cacher, Marseille ») avec le lien du site.
16. **SIRET** pour les mentions légales (`locales/*.json` → `legal.editorText`).
17. **Nom de domaine** : par exemple traiteur-sonigo.fr, à brancher sur Vercel.
