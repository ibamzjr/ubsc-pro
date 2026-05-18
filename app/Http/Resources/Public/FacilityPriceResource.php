<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacilityPriceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'user_category' => $this->user_category,
            'label'         => $this->label,
            'price'         => $this->price,
            'notes'         => $this->notes,
        ];
    }
}
