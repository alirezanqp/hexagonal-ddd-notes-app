export type EntityId = string;

export default abstract class Entity {
  public abstract id: EntityId;

  public equals(anEntity: Entity) {
    if (this === anEntity) {
      return true;
    }

    if (anEntity instanceof Entity && this.id === anEntity.id) {
      return true;
    }

    return false;
  }
}
