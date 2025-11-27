import type { FoodItem } from "@/types/FoodItem";
import parseFoodToRead from "@/utils/parseFoodToRead";

export function parsePartial(food: FoodItem, currentSlide: number) {
    switch (currentSlide) {
        case 0:
            parseFoodToRead({ nutritions: food.nutritions })
            break;
        case 1:
            parseFoodToRead({ description: food.description })
            break;
        case 2:
            parseFoodToRead({ allergens: food.allergens })
            break;
        case 3:
            parseFoodToRead({ 
                ingredients: food.ingredients,
                certifications: food.certifications 
            })
            break;
    
        default:
            break;
    }
}