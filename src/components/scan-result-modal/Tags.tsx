interface TagsProps {
  tags: string[]
}

export default function Tags({ tags }: TagsProps) {
  return (
    <div className="flex gap-1.5">
      {tags.map(tag => (
        <p key={tag} className="bg-gray-500 text-gray-200 text-sm px-3 py-0.5 rounded-lg">
          {tag}
        </p>
      ))}
    </div>
  )
}
