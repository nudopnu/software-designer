import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods } from "@ngrx/signals";
import { addEntity, removeEntity, withEntities } from "@ngrx/signals/entities";
import { AttributeEntity } from "./entities.model";

export const AttributeStore = signalStore(
    { providedIn: 'root' },
    withEntities<AttributeEntity>(),
    withComputed((store) => ({
        connections: computed(() => {
            return store.entities()
                .filter(attribute => attribute.keyType === 'foreign')
                .map(attribute => ({ start: attribute.connectedTo!, end: attribute }));
        })
    })),
    withMethods((store) => ({
        addAttribute(attribute: AttributeEntity) {
            patchState(store, addEntity(attribute));
        },
        deleteAttribute(attribute: AttributeEntity) {
            patchState(store, removeEntity(attribute.id));
        }
    }))
)