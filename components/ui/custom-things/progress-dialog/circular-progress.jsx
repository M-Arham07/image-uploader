"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function CircularProgress({
  progress = 0,
  size = 120,
  strokeWidth = 10,
  colorClass = "stroke-primary",
}) {
  const [offset, setOffset] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const clamped = Math.min(Math.max(progress, 0), 100)
    const offset = ((100 - clamped) / 100) * circumference
    setOffset(offset)
  }, [progress, circumference])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background ring */}
        <circle
          className={cn("opacity-20", colorClass)}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          stroke="currentColor"
        />
        {/* Foreground progress ring */}
        <circle
          className={colorClass}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      {/* Centered Percentage */}
      <span
        className={cn(
          "absolute font-medium",
          size >= 120 ? "text-lg" : "text-sm",
          colorClass.replace("stroke-", "text-"),
        )}
      >
        {Math.round(progress)}%
      </span>
    </div>
  )
}
