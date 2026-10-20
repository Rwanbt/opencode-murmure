# OpenCode Murmure Voice — plugin V2

## Objectif
Plugin **OpenCode V2 indépendant** communiquant avec Murmure local : dicter des prompts en français (STT), écouter les réponses de l'agent via Pocket TTS (TTS), contrôler la lecture et voir un petit overlay hover externe sur Desktop.

## Non-objectifs
Aucun Jarvis, hotword, écoute permanente, full-duplex, barge-in ou acceptation vocale automatique de permissions. Aucun patch, fork ou injection DOM dans OpenCode officiel.

## Architecture
```text
OpenCode V2 TUI / Desktop (officiel, inchangé)
     ⇅ API client + événements + plugin @opencode/plugin
Plugin opencode-murmure (TypeScript)
     ⇅ RPC sécurisé et versionné sur loopback
Murmure Voice (fork Rwanbt/murmure)
     ├─ STT local existant (Parakeet)
     ├─ Pocket TTS CPU français
     └─ capsule externe hover (Desktop)
```

## Flux STT
Association workspace/session explicite ; raccourci/commande utilisateur pour dicter ; transcription locale ; **aperçu modifiable obligatoire**, annulation possible ; envoi uniquement après validation à la session vérifiée. Ne jamais transformer un texte reconnu en permission acceptée.

## Flux TTS
Souscrire aux événements officiels d'OpenCode, récupérer le contenu de réponse accessible, filtrer code/logs/secrets par défaut, assembler les phrases et faire lire via Murmure. Dédupliquer identifiants de session/message ; ne jamais relire les événements anciens après reconnexion ; stop/pause/reprise immédiats.

## Overlay
Fenêtre native externe flottante, ouverte quand le plugin détecte une session liée : affichage connexion, texte de transcription/lecture, bouton micro, pause/reprise/stop. Le survol déploie l'overlay ; il n'est **pas injecté** dans l'UI officielle. Test multi-écran/focus/DPI et version TUI sans fenêtre.

## Qualité
Détection version API OpenCode V2 et refus gracieux si incompatible. Tests Windows Desktop packagé et TUI au SHA exact. Sécurité : auth de l'API locale, aucun token OpenCode exposé à l'overlay, aucune écoute sur une interface réseau publique.
