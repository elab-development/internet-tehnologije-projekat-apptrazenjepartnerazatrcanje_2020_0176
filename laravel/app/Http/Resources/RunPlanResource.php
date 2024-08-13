<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RunPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'location' => $this->location,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'time' => $this->time,
            'distance' => $this->distance,
            'user' => new UserResource($this->user),
            'participants' => RunParticipantResource::collection($this->participants),
            'comments' => CommentResource::collection($this->comments),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
