export default function trimLabel(label) {
  return label.length >= 18 ? `${label.slice(0, 15)}...` : label
}
