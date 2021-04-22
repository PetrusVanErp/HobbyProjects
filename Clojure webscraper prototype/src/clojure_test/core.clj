(ns clojure-test.core
  (:require [net.cgrand.enlive-html :as html])
  (:import (java.net URL)))

(def final-fantasy-fandom-dungeon-url "https://finalfantasy.fandom.com/wiki/Dungeon_(Final_Fantasy_XIV)")
(def final-fantasy-fandom-dungeon-page (html/html-resource (URL. final-fantasy-fandom-dungeon-url)))

(def final-fantasy-lodestone-gear-url "https://na.finalfantasyxiv.com/lodestone/playguide/db/item/?category2=1")
(def final-fantasy-lodestone-userprofile-url "https://na.finalfantasyxiv.com/lodestone/character/")

(defn getDungeonsFromSource []
  (try
    (map html/text
         (html/select
           final-fantasy-fandom-dungeon-page
           #{[:table :tbody :tr [:th (html/nth-child 2)] :a] [:table :tbody :tr [:td (html/nth-child 3)]]})
         )
    (catch Exception e (.getMessage e)))
  )

(defn getRecommendedDungeons [characterLvl]
  (doseq [line (map (fn [[name level]] (if (<= (Long/valueOf (clojure.string/replace level "\n" "")) characterLvl)
                                         (if (> (Long/valueOf (clojure.string/replace level "\n" "")) (- characterLvl 8))
                                           (str "dungeon: " name " - level: " (clojure.string/replace level "\n" ""))
                                           )
                                         )
                      )
                    (partition 2 (getDungeonsFromSource)))]
    (if (not (nil? line)) (println line))
    )
  )

(defn getGearFromSource [minLvl maxLvl characterClassCategoryId]
  (try
    (let [final-fantasy-lodestone-altered-gear-url (clojure.string/join [final-fantasy-lodestone-gear-url "&min_gear_lv=" minLvl "&max_gear_lv=" maxLvl "&category3=" characterClassCategoryId])]
      (let [final-fantasy-lodestone-altered-gear-page (html/html-resource (URL. final-fantasy-lodestone-altered-gear-url))]
        (map html/text
             (html/select
               final-fantasy-lodestone-altered-gear-page
               #{[:table :tbody :tr [:td (html/nth-child 1)] [:div (html/nth-child 2)] :a] [:table :tbody :tr [:td (html/nth-child 3)]]})
             )
        )
      )
    (catch Exception e (.getMessage e)))
  )

(defn getCharacterClassCategoryId [characterClass]
  (case characterClass
    "GLD" 2
    "MRD" 3
    "DRK" 87
    "GNB" 106
    "LNC" 5
    "PGL" 1
    "SMR" 96
    "ROG" 84
    "ARC" 4
    "MCH" 88
    "DNC" 107
    "ACN" 10
    "RDM" 97
    "SCH" 98
    "AST" 89
    )
  )

(defn getGearMin [characterLvl]
  (cond
    (and (> characterLvl 0) (< characterLvl 11)) 1
    (and (> characterLvl 10) (< characterLvl 21)) 11
    (and (> characterLvl 20) (< characterLvl 31)) 21
    (and (> characterLvl 30) (< characterLvl 41)) 31
    (and (> characterLvl 40) (< characterLvl 51)) 41
    (and (> characterLvl 50) (< characterLvl 61)) 51
    (and (> characterLvl 60) (< characterLvl 71)) 61
    :else 71
    )
  )

(defn getGearMax [characterLvl]
  (cond
    (and (> characterLvl 0) (< characterLvl 11)) 10
    (and (> characterLvl 10) (< characterLvl 21)) 20
    (and (> characterLvl 20) (< characterLvl 31)) 30
    (and (> characterLvl 30) (< characterLvl 41)) 40
    (and (> characterLvl 40) (< characterLvl 51)) 50
    (and (> characterLvl 50) (< characterLvl 61)) 60
    (and (> characterLvl 60) (< characterLvl 71)) 70
    :else 80
    )
  )

(defn getRecommendedGear [characterLvl characterClass]
  (let [minLvl (getGearMin characterLvl)]
    (let [maxLvl (getGearMax characterLvl)]
      (let [characterClassCategoryId (getCharacterClassCategoryId characterClass)]
        (doseq [line (map (fn [[name level]] (if (<= (Long/valueOf level) characterLvl) (str "weapon name: " name " - level: " level)))
                          (partition 2 (getGearFromSource minLvl maxLvl characterClassCategoryId)))]
          (if (not (nil? line)) (println line))
          )
        )
      )
    )
  )

(defn getUserInformationFromSource [userId]
  (try
    (let [final-fantasy-lodestone-altered-userprofile-url (clojure.string/join [final-fantasy-lodestone-userprofile-url userId])]
      (let [final-fantasy-lodestone-altered-userprofile-page (html/html-resource (URL. final-fantasy-lodestone-altered-userprofile-url))]
        (map html/text
             (html/select
               final-fantasy-lodestone-altered-userprofile-page
               #{[:div.character__profile__data__detail :div.character-block :div.character-block__box [:p (html/nth-child 1)]] [:div.character__profile__data__detail :div.character-block :div.character-block__box [:p (html/nth-child 2)]]}
               )
             )
        )
      )
    (catch Exception e (.getMessage e)))
  )

(defn getUserInformation [userId]
  ;Use this id if you do not have a lodestone account: 34228729
  (doseq [line (map (fn [[name content]] (str name ": " content))
                    (partition 2 (getUserInformationFromSource userId)))]
    (println line)
    )
  )

;Main function using a multi-artiy function
(defn finalFantasyScraper ([characterLvl characterClass userId]
                           (println "User information based on userId" userId ": \n")
                           (getUserInformation userId)
                           (finalFantasyScraper characterLvl characterClass)
                           )
  ([characterLvl characterClass]
   (println "These are gear and dungeon recommendations based on the given level and class \n")
   (println "These are the recommended dungeons that you can play being lvl" characterLvl ": \n")
   (getRecommendedDungeons characterLvl)
   (println "\nThese are the weapons that you can use as a" characterClass "on level" characterLvl ": \n")
   (getRecommendedGear characterLvl characterClass)
   )
  )

;Main function using a variadic function
(defn finalFantasyScraperVariadic ([characterLvl characterClass & userId]
                                   (println "User information based on userId" (first userId) ": \n")
                                   (getUserInformation (first userId))
                                   (println "These are gear and dungeon recommendations based on the given level and class \n")
                                   (println "These are the recommended dungeons that you can play being lvl" characterLvl ": \n")
                                   (getRecommendedDungeons characterLvl)
                                   (println "\nThese are the weapons that you can use as a" characterClass "on level" characterLvl ": \n")
                                   (getRecommendedGear characterLvl characterClass)
                                   )
  )

