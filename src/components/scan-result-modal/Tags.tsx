import { TAG_ITEM_CLASS } from './_constants/style'

interface TagsProps {
  tags: string[]
}

export default function Tags({ tags }: TagsProps) {
  return (
    <div className="flex gap-1.5 whitespace-nowrap">
      {tags.map(tag => (
        <p key={tag} className={TAG_ITEM_CLASS}>
          {tag}
        </p>
      ))}
    </div>
  )
}
